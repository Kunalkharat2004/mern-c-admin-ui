import {
  ExclamationCircleOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Modal,
  Result,
  Space,
  Table,
  Grid,
} from "antd";
import { NavLink } from "react-router-dom";
import { createRestaurant, getAllTenants } from "../../http/api";
import { useMemo, useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import RestaurantsFilter from "./RestaurantsFilter";
import { useForm } from "antd/es/form/Form";
import RestaurantForm from "./RestaurantForm";
import { FieldData, Restaurant } from "../../types";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Restaurants",
    link: "/restaurants",
  },
];

const getColumns = (screens: Record<string, boolean>) => [
  {
    title: "Name",
    dataIndex: "name",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
    render: (text: string) => {
      return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    width: screens.xs ? 200 : "40%",
    ellipsis: true,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
    render: (createdAt: Date) => {
      const date = new Date(createdAt);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: screens.xs ? "short" : "long",
        year: "numeric",
      });
    },
  },
];

const RestaurantsPage = () => {
  const screens = useBreakpoint();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage:5
  });
  const notification = useNotification();
  const [form] = useForm();
  const [formFilter] = Form.useForm();
  const {user} = useAuthStore();

  const addRestaurant = async (restaurantData: Restaurant) => {
    await createRestaurant(restaurantData);
  };

  const { mutate, isPending: createRestaurantMutationPending } = useMutation({
    mutationKey: ["createRestaurant"],
    mutationFn: addRestaurant,
    onSuccess: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.success("Restaurant created successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },

    onError: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.error("Something went wrong");
    },
  });

  const handleOnSubmit = async () => {
    await form.validateFields();
    console.log(form.getFieldsValue());
    mutate(form.getFieldsValue() as Restaurant);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    setDrawerOpen(false);
    notification.success("Restaurant creation cancelled");
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getTenants = async () => {
    const filteredValues = Object.fromEntries(Object.entries(queryParams).filter((item)=> !!item[1]));
    const queryParamsString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getAllTenants(queryParamsString);
    return data;
  };

  const {
    data: tenants,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tenants",queryParams],
    queryFn: getTenants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  
  const debounceQUpdate = useMemo(()=>{
    return debounce((value:string | undefined)=>{
      setQueryParams((prev)=>({
        ...prev,
        q:value,
        currentPage:1
      }))
    },500)
},[])

  const handleFilterChange = (changedFields: FieldData[])=>{
    const filter = changedFields.map((item)=>({
      [item.name[0]]: item.value
    }))
    .reduce((acc,curr)=>({...acc, ...curr}),{})

   if("q" in filter){
    debounceQUpdate(filter.q);
   }else{
    setQueryParams((prev)=>({
      ...prev,
      ...filter,
      currentPage:1
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
        form={formFilter}
        onFieldsChange={handleFilterChange}
       >
       <RestaurantsFilter
          onFilterChange={(FilterName, FilterValue) =>
            console.log(FilterName, FilterValue)
          }
        >
          {
            user?.role === "admin" && (
              <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            Add Restaurant
          </Button>
          )
          }
        </RestaurantsFilter>
       </Form>

        <Drawer
          title="Create a new restaurant"
          width={screens.xs ? "100%" : 720}
          loading={createRestaurantMutationPending}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
          }}
          destroyOnClose={true}
          open={drawerOpen}
          placement={screens.xs ? "bottom" : "right"}
          height={screens.xs ? "80%" : undefined}
          extra={
            <Space>
              <Button onClick={() => setIsModalOpen(true)}>Cancel</Button>
              <Modal
                title={
                  <span>
                    <ExclamationCircleOutlined
                      style={{ marginRight: 8, color: "#faad14" }}
                    />
                    Are you sure you want to cancel?
                  </span>
                }
                destroyOnClose={true}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Yes"
                cancelText="No"
              />
              <Button onClick={handleOnSubmit} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form
            layout="vertical"
            style={{
              width: "100%",
              padding: screens.xs ? "8px" : "24px",
            }}
            onFinish={(values) => {
              console.log(values);
            }}
            form={form}
          >
            <RestaurantForm />
          </Form>
        </Drawer>

        <div
          className="table-container"
          style={{ width: "100%", overflowX: "auto", maxWidth: "100vw" }}
        >
          <Table
            rowKey={"id"}
            columns={getColumns(screens)}
            dataSource={tenants?.data}
            loading={isPending}
            size={screens.xs ? "small" : ("middle" as const)}
            scroll={{
              x: screens.xs ? 500 : "100%",
              scrollToFirstRowOnChange: true,
            }}
            style={{
              minWidth: screens.xs ? 500 : "auto",
              whiteSpace: "nowrap",
            }}
            pagination={{
              current: queryParams.currentPage,
              pageSize: queryParams.perPage,
              total: tenants?.total,
              onChange:(page)=>{
                setQueryParams((prev) => {
                  return {
                    ...prev,
                    currentPage: page,
                  };
                });
              },
              size: screens.xs ? "small" : ("default" as const),
              showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total}`,
              showQuickJumper: !screens.xs,
              style: {
                marginTop: screens.xs ? "8px" : "16px",
              },
            }}
          />
        </div>
      </Space>
    </>
  );
};

export default RestaurantsPage;
