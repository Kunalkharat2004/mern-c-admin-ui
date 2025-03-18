import { ExclamationCircleOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Modal, Result, Space, Table } from "antd";
import { NavLink } from "react-router-dom";
import { getAllUsers } from "../../http/api";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notification = useNotification();

  const handleModalOk = () => {
    setIsModalOpen(false);
    setDrawerOpen(false);
    notification.success("User creation cancelled");
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getUsers = async () => {
    const { data } = await getAllUsers();
    return data;
  };

  const { data: users, isPending, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
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
          dataSource={users}
          loading={isPending}
          />;

      </Space>
    </>
  );
};

export default UsersPage;
