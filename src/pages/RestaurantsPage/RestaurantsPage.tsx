import { ExclamationCircleOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Modal, Result, Space, Table } from "antd";
import { NavLink } from "react-router-dom";
import { getAllTenants } from "../../http/api";
import { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import RestaurantsFilter from "./RestaurantsFilter";

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Restaurants",
    link: "/restaurants",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
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
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (createdAt:Date)=>{
        const date = new Date(createdAt);
        return date.toLocaleDateString("en-GB",{
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }
  },
];

const RestaurantsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notification = useNotification();

  const handleModalOk = () => {
    setIsModalOpen(false);
    setDrawerOpen(false);
    notification.success("Restaurant creation cancelled");
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getTenants = async () => {
    const { data } = await getAllTenants();
    return data;
  };

  const { data: tenants, isPending,isError,refetch } = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });

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
        <RestaurantsFilter
          onFilterChange={(FilterName, FilterValue) =>
            console.log(FilterName, FilterValue)
          }
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            Add Restaurant
          </Button>
        </RestaurantsFilter>

        <Drawer
          title="Create a new restaurant"
          width={720}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
          }}
          destroyOnClose={true}
          open={drawerOpen}
          extra={
            <Space>
              <Button onClick={() => setIsModalOpen(true)}>Cancel</Button>
              <Modal
               title={
                <span>
                  <ExclamationCircleOutlined style={{ marginRight: 8, color: "#faad14" }} />
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
              <Button onClick={() => {}} type="primary">
                Submit
              </Button>
            </Space>
          }
        ></Drawer>

        <Table 
        rowKey={"id"}
         columns={columns}
          dataSource={tenants}
          loading={isPending}
          />;

      </Space>
    </>
  );
};

export default RestaurantsPage;