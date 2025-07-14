import { format } from "date-fns";
import { OrderType } from "../../types/order";
import { Breadcrumb, Button, Grid, Result, Space, Table, Tag, Typography } from "antd";
import { Link, NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getOrders } from "../../http/api";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Orders",
    link: "/orders",
  },
];

const orderStatusTagColor: { [key: string]: string } = {
  received: "green",
  confirmed: "blue",
  preparing: "orange",
  out_for_delivery: "teal",
  delivered: "gray",
};

const getColumns = (screens: Record<string, boolean>) => [
   {
    title: "Order ID",
    dataIndex: "_id",
    key: "_id",
    width: screens.xs ? 80 : 100,
    minWidth: 100,
    ellipsis: true,
    resizable: true,
    render: (_text: string) => {
      return (
        <Typography.Text 
          code
          style={{ 
            fontSize: screens.xs ? "11px" : "12px",
            fontWeight: 500 
          }}
        >
          {_text.slice(-8)}
        </Typography.Text>
      );
    },
  },
  {
    title: "Customer",
    dataIndex: ["customer", "0", "firstName"],
    key: "customer",
    width: screens.xs ? 180 : "10%",   // Moderate width
    ellipsis: true,
    render: (_text: string, record: OrderType) => {
      const cust = record.customer[0];
      const fullName = cust
        ? `${cust.firstName.charAt(0).toUpperCase()}${cust.firstName.slice(1)} ${cust.lastName.charAt(0).toUpperCase()}${cust.lastName.slice(1)}`
        : "—";
      return <Typography.Text>{fullName}</Typography.Text>;
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address.text",
    width: screens.xs ? 200 : "25%",   // Increased width for address
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Typography.Text>
        {record.address.text
          ?.split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")}
      </Typography.Text>
    ),
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    width: screens.xs ? 180 : "15%",   // Moderate width
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Typography.Text>
        {record.comment
          ? record.comment
              .split(" ")
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")
          : "--"}
      </Typography.Text>
    ),
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    width: screens.xs ? 140 : "10%",   // Smaller width
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Tag color={
        record.paymentMode === "card"? "#3b5999":"#87d068"
      }>
        {record.paymentMode === "cod" ? "Cash on Delivery" : "Card"}
      </Tag>
    ),
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    width: screens.xs ? 140 : "10%",   // Smaller width
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Tag color={orderStatusTagColor[record.orderStatus]}> 
        {record.orderStatus
          ?.split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")}
      </Tag>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    width: screens.xs ? 120 : "7%",   // Compact width
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Typography.Text>&#x20b9; {record.total}</Typography.Text>
    ),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: screens.xs ? 180 : "15%",   // Compact width
    ellipsis: true,
    render: (text: string) => (
      <Typography.Text>{format(new Date(text), "dd/MM/yyyy HH:mm")}</Typography.Text>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: screens.xs ? 100 : "8%",   // Smallest width
    ellipsis: true,
    render: (_: string, record: OrderType) => (
      <Space>
        <Link to={`/orders/${record._id}`}>Details</Link>
      </Space>
    ),
  },
];


const OrdersPage = () => {
  const screens = useBreakpoint();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 5,
  });

  const {
    data: orders,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", queryParams],
    queryFn: async () => {
      return await getOrders("orderStatus=received").then((res) => res.data);
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
        <div
          className="table-container"
          style={{ width: "100%", overflowX: "auto", maxWidth: "100vw" }}
        >
          <Table
            rowKey={"_id"}
            columns={getColumns(screens)}
            dataSource={orders?.data}
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
              current: queryParams.page,
              pageSize: queryParams.limit,
              total: orders?.data.total,
              onChange: (page) => {
                setQueryParams((prev) => {
                  return {
                    ...prev,
                    page: page,
                  };
                });
              },
              size: screens.xs ? "small" : ("default" as const),
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total}`,
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
export default OrdersPage;
