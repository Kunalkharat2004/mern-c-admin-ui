import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Form, Result, Space, Table } from "antd";
import { NavLink } from "react-router-dom";
import { createUser, getAllUsers } from "../../http/api";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./UserForm";
import { User } from "../../types";
import { useNotification } from "../../context/NotificationContext";

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Users",
    link: "/users",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "firstName",
    render: (text: string, record: { firstName: string; lastName: string }) =>
      `${record.firstName} ${record.lastName}`,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const UsersPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getUsers = async () => {
    const { data } = await getAllUsers();
    return data;
  };
const notification = useNotification();

  const addUser = async (userData:User) =>{
    await createUser(userData);
  }

  const { data: users, isPending, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {mutate,isPending: createUserMutationPending} = useMutation({
    mutationKey:["createUser"],
    mutationFn: addUser,
    onSuccess: ()=>{
      setDrawerOpen(false);
      form.resetFields();
      notification.success("User created successfully");
      refetch();
    },

    onError: ()=>{
      setDrawerOpen(false);
      form.resetFields();
      notification.error("Something went wrong");
    }
  })

  const [form] = Form.useForm();

  const handleOnSubmit = async ()=>{
    await form.validateFields();
    console.log(form.getFieldsValue());
    mutate(form.getFieldsValue() as User);
  }

  if(isError){
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
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb separator={<RightOutlined />} items={BreadcrumbItems} />
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
          >
            Add User
          </Button>
        </UsersFilter>

        <Drawer
          title="Create a new user"
          width={720}
          loading={createUserMutationPending}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
          }}
          destroyOnClose={true}
          open={drawerOpen}
          extra={
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleOnSubmit} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form
          layout="vertical"
          onFinish={(values) => {
            console.log(values);
          }}
          form={form}
          >
        <UserForm />

          </Form>

        </Drawer>

        <Table 
        rowKey={"id"}
         columns={columns}
          dataSource={users}
          loading={isPending}
          />

      </Space>
    </>
  );
};

export default UsersPage;
