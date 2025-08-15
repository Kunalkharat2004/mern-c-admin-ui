import { format } from "date-fns";
import {
  OrderEvents,
  OrderType,
  PaymentMode,
  PaymentStatus,
} from "../../types/order";
import { Breadcrumb, Form, Grid, Space, Table, Tag, Typography } from "antd";
import { Link, NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getOrders } from "../../http/api";
import OrdersFilter from "./OrdersFilter";
import { FieldData } from "../../types";
import { orderStatusTagColor } from "../../constants";
import OnError from "../../components/custom/OnError";
import Loader from "../../assets/Icons/common/Loader";
import socket from "../../lib/socket";
import { useAuthStore } from "../../store";

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
            fontWeight: 500,
          }}
        >
          {_text.slice(-8)}
        </Typography.Text>
      );
    },
  },
  {
    title: "Customer",
    dataIndex: ["customerId"],
    key: "customerId",
    width: screens.xs ? 180 : "10%", // Moderate width
    ellipsis: true,
    render: (_text: string, record: OrderType) => {
      const cust = record.customerId as
        | { firstName?: string; lastName?: string }
        | undefined;
      const fullName =
        cust && cust.firstName && cust.lastName
          ? `${cust.firstName.charAt(0).toUpperCase()}${cust.firstName.slice(
              1
            )} ${cust.lastName.charAt(0).toUpperCase()}${cust.lastName.slice(
              1
            )}`
          : "—";
      return <Typography.Text>{fullName}</Typography.Text>;
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address.text",
    width: screens.xs ? 200 : "25%", // Increased width for address
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
    width: screens.xs ? 180 : "15%", // Moderate width
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Typography.Text>
        {record.comment
          ? record.comment
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
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
    width: screens.xs ? 140 : "10%", // Smaller width
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Tag color={record.paymentMode === "card" ? "#3b5999" : "#87d068"}>
        {record.paymentMode === "cod" ? "Cash on Delivery" : "Card"}
      </Tag>
    ),
  },
  {
    title: "Order Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    width: screens.xs ? 140 : "10%", // Smaller width
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
    width: screens.xs ? 120 : "7%", // Compact width
    ellipsis: true,
    render: (_text: string, record: OrderType) => (
      <Typography.Text>&#x20b9; {record.total}</Typography.Text>
    ),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: screens.xs ? 180 : "15%", // Compact width
    ellipsis: true,
    render: (text: string) => (
      <Typography.Text>
        {format(new Date(text), "dd/MM/yyyy HH:mm")}
      </Typography.Text>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: screens.xs ? 100 : "8%", // Smallest width
    ellipsis: true,
    render: (_: string, record: OrderType) => (
      <Space>
        <Link to={`/orders/${record._id}`}>Details</Link>
      </Space>
    ),
  },
];

const OrdersPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (user?.tenant) {

         socket.on("client-joined", (data) => {
        console.log("Client joined to room: ", data.roomId);
      });
      
      socket.emit("join", { tenantId: user?.tenant?.id });

      socket.on("order-update", (socketData) => {
        console.log("data received: ", socketData);

        // Extract the actual order data from the socket response
        const newOrder = socketData.data;

        // Define conditions for when to add order to the list
        const shouldAddOrder =
          // Case 1: COD orders - add immediately when created
          (socketData.event_type === OrderEvents.ORDER_CREATED &&
            socketData.data.paymentMode === PaymentMode.CASH) ||
          // Case 2: Card orders - only add when payment is completed
          (socketData.event_type === OrderEvents.ORDER_CREATED &&
            socketData.data.paymentMode === PaymentMode.CARD &&
            socketData.data.paymentStatus === PaymentStatus.PAID) ||
          // Case 3: Payment status updates for card orders - add when payment becomes paid
          (socketData.event_type === OrderEvents.PAYMENT_STATUS_UPDATE &&
            socketData.data.paymentMode === PaymentMode.CARD &&
            socketData.data.paymentStatus === PaymentStatus.PAID);

        if (shouldAddOrder) {
          queryClient.setQueryData(
            ["orders", queryParams],
            (oldData: { data: OrderType[]; total: number } | undefined) => {
              if (!oldData) return oldData;

              // Check if order already exists to prevent duplicates
              const orderExists = oldData.data.some(
                (order: OrderType) => order._id === newOrder._id
              );

              if (!orderExists) {
                // Add the new order to the beginning of the existing data array
                return {
                  ...oldData,
                  data: [newOrder, ...oldData.data],
                };
              }

              // If it's a payment status update, update the existing order
              if (socketData.event_type === OrderEvents.PAYMENT_STATUS_UPDATE) {
                return {
                  ...oldData,
                  data: oldData.data.map((order: OrderType) =>
                    order._id === newOrder._id ? newOrder : order
                  ),
                };
              }

              return oldData; // No changes if order already exists
            }
          );
        }
      });

   
    }

    return () => {
      socket.off("order-update");
      socket.off("client-joined");
    };
  }, [queryClient, queryParams, user?.tenant]);

  const screens = useBreakpoint();
  const [formfilter] = Form.useForm();

  const getAllOrders = async () => {
    const filteredValues = Object.fromEntries(
      Object.entries(queryParams).filter((item) => !!item[1])
    );
    const queryParamasString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getOrders(queryParamasString);
    return data;
  };
  const {
    data: orders,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", queryParams],
    queryFn: getAllOrders,
    placeholderData: keepPreviousData,
  });

  const handleFilterChange = (changedFields: FieldData[]) => {
    // {
    // tenantId: "2adeb26a-266e-4ff4-8b0b-ec79cefdfaf7",
    // paymentStatus: "paid"
    // }
    console.log("Changed fields: ", changedFields);

    const filter = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

    setQueryParams((prev) => ({
      ...prev,
      ...filter,
      page: 1,
    }));
  };
  if (isError) {
    return <OnError refetch={refetch} />;
  }
  if (isPending) {
    return (
      <>
        <Loader />
      </>
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
        <Form form={formfilter} onFieldsChange={handleFilterChange}>
          <OrdersFilter />
        </Form>
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
              total: orders?.total,
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
