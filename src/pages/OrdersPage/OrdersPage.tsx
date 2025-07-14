// import { format } from "date-fns";
// import { OrderType } from "../../types/order";
import { Breadcrumb, Grid, Space } from "antd";
import { NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

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

// const getColumns = (screens: Record<string, boolean>) => [
//   {
//     title: "Order Id",
//     dataIndex: "_id",
//     key: "_id",
//     width: screens.xs ? 150 : "30%",
//     ellipsis: true,
//   },
//   {
//     title: "Customer",
//     dataIndex: "customer",
//     key: "customer._id",
//     width: screens.xs ? 200 : "40%",
//     ellipsis: true,
//     render: (_text: string, record: OrderType) => {
//       return (
//         <Typography.Text>
//           {
//           record.customer.firstName.charAt(0).toUpperCase()+record.customer.firstName.slice(1)
//            + " " + 
//             record.customer.lastName.charAt(0).toUpperCase()+record.customer.lastName.slice(1)
//            }
//         </Typography.Text>
//       );
//     },
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//     key: "address.text",
//     width: screens.xs ? 150 : "30%",
//     ellipsis: true,
//     render: (_text: string, record: OrderType) => {
//       return (
//         <Typography.Text>
//           {record.address.text
//             ?.split(" ")
//             .map(
//               (word) =>
//                 word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//             )
//             .join(" ")}
//         </Typography.Text>
//       );
//     },
//   },
//   {
//     title: "Comment",
//     dataIndex: "comment",
//     key: "comment",
//     width: screens.xs ? 150 : "30%",
//     ellipsis: true,
//     render: (_text: string, record: OrderType) => {
//       return (
//         <Typography.Text>
//           {record.comment
//             ?.split(" ")
//             .map(
//               (word) =>
//                 word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//             )
//             .join(" ")}
//         </Typography.Text>
//       );
//     },
//   },
//   {
//     title: "Payment Mode",
//     dataIndex: "paymentMode",
//     key: "paymentMode",
//     width: screens.xs ? 150 : "30%",
//     ellipsis: true,
//     render: (_text: string, record: OrderType) => {
//       return (
//         <Typography.Text>
//           {record.paymentMode
//             ?.split(" ")
//             .map(
//               (word) =>
//                 word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//             )
//             .join(" ")}
//         </Typography.Text>
//       );
//     },
//   },
//   {
//     title: "Status",
//     dataIndex: "orderStatus",
//     key: "orderStatus",
//     width: screens.xs ? 150 : "30%",
//     ellipsis: true,
//     render: (_text: string, record: OrderType) => {
//       return (
//         <Badge className="bg-green-500">
//           {record.orderStatus
//             ?.split(" ")
//             .map(
//               (word) =>
//                 word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//             )
//             .join(" ")}
//         </Badge>
//       );
//     },
//   },
//   {
//     title: "Total",
//     dataIndex: "total",
//     key: "total",
//     width: screens.xs ? 150 : "30%",
//     ellipsis: true,
//   },
// {
//     title: "Created At",
//     dataIndex: "createdAt",
//     width: screens.xs ? 150 : "30%",
//     ellipsis: true,
//     render: (text: string) => {
//       return (
//         <Typography.Text>
//           {format(new Date(text), "dd/MM/yyyy HH:MM")}
//         </Typography.Text>
//       );
//     },
//   },
// ];

const OrdersPage = () => {
      const screens = useBreakpoint();
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
            </Space>
    
    </>
}
export default OrdersPage;
