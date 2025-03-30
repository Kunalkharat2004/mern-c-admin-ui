import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Result,
  Space,
  Table,
  Grid,
} from "antd";
import { NavLink } from "react-router-dom";
import { createUser, getAllUsers } from "../../http/api";
import UsersFilter from "./UsersFilter";
import { useMemo, useState } from "react";
import UserForm from "./UserForm";
import { FieldData, User } from "../../types";
import { useNotification } from "../../context/NotificationContext";
import { debounce } from "lodash";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Users",
    link: "/users",
  },
];

const getColumns = (screens: Record<string, boolean>) => [
  {
    title: "Name",
    dataIndex: "firstName",
    width: screens.xs ? 150 : "25%",
    ellipsis: true,
    render: (text: string, record: { firstName: string; lastName: string }) => {
      return `${record.firstName} ${record.lastName}`
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
  },
  {
    title: "Role",
    dataIndex: "role",
    width: screens.xs ? 100 : "15%",
    ellipsis: true,
  },
  {
    title: "Restaurant",
    dataIndex: "tenant",
    width: screens.xs ? 150 : "25%",
    ellipsis: true,
    render: (_text: string, record: User) => {
      // show null if tenant is null
      if (!record.tenant) return '--';
      return record.tenant.name;
    },
  },

  {
    title: "Address",
    dataIndex: "address",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
  },
];

const UsersPage = () => {
  const screens = useBreakpoint();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: 5,
  });

  const getUsers = async () => {
    const filteredValues = Object.fromEntries(Object.entries(queryParams).filter((item)=> !!item[1]));
    const queryParamasString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getAllUsers(queryParamasString);
    return data;
  };
  const notification = useNotification();

  const addUser = async (userData: User) => {
    await createUser(userData);
  };

  const {
    data: users,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: getUsers,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate, isPending: createUserMutationPending } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: addUser,
    onSuccess: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.error("Something went wrong");
    },
  });

  const [form] = Form.useForm();
  const [formfilter] = Form.useForm();

  const handleOnSubmit = async () => {
    await form.validateFields();
    console.log(form.getFieldsValue());
    mutate(form.getFieldsValue() as User);
  };


  const debounceQUpdate = useMemo(()=>{
      return debounce((value:string | undefined)=>{
        setQueryParams((prev)=>({
          ...prev,
          q:value
        }))
      },500)
  },[])

  const handleFilterChange = (changedFields: FieldData[])=>{
    // {
    // q: "K",
    // role: "admin"   
  // }
console.log("Changed fields: ",changedFields);

  const filter = changedFields.map((item)=>({
    [item.name[0]]: item.value
  }))
  .reduce((acc,curr)=>{
    return {...acc, ...curr}
  },{})

  if('q' in filter){
    debounceQUpdate(filter.q);
  }else{
    setQueryParams((prev)=>({
      ...prev,
      ...filter
    }))
  }

 
  }

  if (isError) {
    return (
      <Result
        status="500"
        title="Something went wrong"
        subTitle="Sorry, we encountered an error while fetching the data."
        extra={[
          <Button type="primary" key="retry" onClick={() => refetch()}>
            Retry
          </Button>,
        ]}
      />
    );
  }

  return (
    <>
      <Space
        direction="vertical"
        size={screens.xs ? "middle" : "large"}
        style={{ width: "100%", overflow: "visible" }}
      >
        <Breadcrumb
          separator={<RightOutlined />}
          items={BreadcrumbItems}
          style={{
            fontSize: screens.xs ? "12px" : "14px",
            marginBottom: screens.xs ? "8px" : "16px",
          }}
        />
       <Form 
       form={formfilter}
       onFieldsChange={handleFilterChange}
       >
       <UsersFilter
          onFilterChange={(FilterName, FilterValue) =>
            console.log(FilterName, FilterValue)
          }
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              console.log("Add User Clicked");
              setDrawerOpen(true);
            }}
            style={{
              width: screens.xs ? "100%" : "auto",
              marginTop: screens.xs ? "8px" : "0",
            }}
          >
            Add User
          </Button>
        </UsersFilter>
       </Form>

        <Drawer
          title="Create a new user"
          width={screens.xs ? "100%" : 720}
          loading={createUserMutationPending}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
          }}
          destroyOnClose={true}
          open={drawerOpen}
          extra={
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleOnSubmit} type="primary">
                Submit
              </Button>
            </Space>
          }
          placement={screens.xs ? "bottom" : "right"}
          height={screens.xs ? "80%" : undefined}
        >
          <Form
            layout="vertical"
            onFinish={(values) => {
              console.log(values);
            }}
            form={form}
            style={{
              padding: screens.xs ? "8px" : "24px",
            }}
          >
            <UserForm />
          </Form>
        </Drawer>

        <div
          className="table-container"
          style={{ width: "100%", overflowX: "auto", maxWidth: "100vw" }}
        >
          <Table
            rowKey={"id"}
            columns={getColumns(screens)}
            dataSource={users?.data}
            loading={isFetching}
            scroll={{
              x: screens.xs ? 550 : "100%",
              scrollToFirstRowOnChange: true,
            }}
            style={{
              minWidth: screens.xs ? 550 : "auto",
              whiteSpace: "nowrap",
            }}
            pagination={{
              current: queryParams.currentPage,
              pageSize: queryParams.perPage,
              total: users?.total,
              onChange: (page) => {
                setQueryParams((prev) => {
                  return {
                    ...prev,
                    currentPage: page,
                  };
                });
              },
              size: screens.xs ? "small" : ("default" as const),
              showSizeChanger: !screens.xs,
              showQuickJumper: !screens.xs,
              showTotal: (total) => `Total ${total} items`,
              style: {
                marginTop: screens.xs ? "8px" : "16px",
              },
            }}
            size={screens.xs ? "small" : ("middle" as const)}
          />
        </div>
      </Space>
    </>
  );
};

export default UsersPage;
