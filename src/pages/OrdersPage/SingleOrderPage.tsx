import {
  RightOutlined,
  DollarOutlined,
  CreditCardOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MessageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Grid,
  Layout,
  List,
  Row,
  Space,
  Tag,
  Typography,
  Descriptions,
  Badge,
} from "antd";
import { NavLink, useParams } from "react-router-dom";
import { getSingleOrder } from "../../http/api";
import { orderStatusTagColor } from "../../constants";
import { OrderStatus, OrderType, PaymentMode, PaymentStatus } from "../../types/order";
import OnError from "../../components/custom/OnError";
import Loader from "../../assets/Icons/common/Loader";
import OrderStatusSelector from "./components/OrderStatusSelector";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const SingleOrderPage = () => {
  const screens = useBreakpoint();
  const { orderId } = useParams();

  const BreadcrumbItems = [
    {
      title: <NavLink to="/">Dashboard</NavLink>,
    },
    {
      title: <NavLink to="/orders">Orders</NavLink>,
    },
    {
      title: `Order #${orderId?.slice(-8)}`,
    },
  ];

  const {
    data: orders,
    isPending,
    isError,
    refetch,
  } = useQuery<OrderType>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const queryfields = {
        fields:
          "cart,address,total,comment,orderStatus,paymentMode,paymentStatus,createdAt,customerId,customer",
      };
      const queryParamasString = new URLSearchParams(queryfields).toString();
      return await getSingleOrder(orderId as string, queryParamasString).then(
        (res) => res.data
      );
    },
  });

  if (isError) {
    return <OnError refetch={refetch} />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  if (isPending) {
    return (
      <>
        <Loader />
      </>
    );
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "success";
      case PaymentStatus.PENDING:
        return "warning";
      case PaymentStatus.FAILED:
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case PaymentMode.CARD:
        return <CreditCardOutlined />;
      case PaymentMode.CASH:
        return <DollarOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  return (
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

      {/* Order Header */}
      <Card>
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ margin: 0 }}>
              Order #{orderId?.slice(-8)}
            </Title>
            <Text type="secondary">
              <CalendarOutlined style={{ marginRight: 8 }} />
              {formatDate(orders.createdAt.toString())}
            </Text>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space size={32}>
              <Space direction="vertical" size="small">
                <Text strong>Status:</Text>
                <Badge
                  status={
                    orders.orderStatus === OrderStatus.DELIVERED
                      ? "success"
                      : "error"
                  }
                  text={
                    <Tag
                      color={
                        orderStatusTagColor[orders.orderStatus ?? "received"]
                      }
                    >
                      {orders.orderStatus
                        ?.split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </Tag>
                  }
                />
              </Space>
              <Space direction="vertical" size="small">
                 <Text strong>Total Amount:</Text>
                 <Typography.Text style={{color:"#f76a31",fontWeight:"bold", fontSize:"1.3rem",}}>₹ {orders.total}</Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={8}>
            {/* // Select Box */}
            <OrderStatusSelector orderId={orders._id as string} orderValue={orders.orderStatus}/>
          
          </Col>
        </Row>
      </Card>

      <Layout>
        <Row gutter={[24, 24]}>
          {/* Order Items */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <Space>
                  <Title level={4} style={{ margin: 0 }}>
                    Order Items
                  </Title>
                  <Tag color="blue">
                    {orders.cart.length} item{orders.cart.length > 1 ? "s" : ""}
                  </Tag>
                </Space>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={orders.cart}
                renderItem={(item) => (
                  <List.Item
                    id={item._id}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={64}
                          src={item.image}
                          style={{ borderRadius: "8px" }}
                        />
                      }
                      title={
                        <Space direction="vertical" size="small">
                          <Text strong style={{ fontSize: "16px" }}>
                            {item.name}
                          </Text>
                          <Space wrap>
                            
                                {
                                    Object.entries(item.choosenConfiguration.priceConfiguration).map(i=>
                                        <Tag color="geekblue">
                                            {i[1]}
                                        </Tag>
                                    )
                                }
                            {/* </Tag> */}
                            {item.choosenConfiguration.selectedToppings.length >
                              0 && (
                              <Tag color="green">
                                +
                                {
                                  item.choosenConfiguration.selectedToppings
                                    .length
                                }{" "}
                                toppings
                              </Tag>
                            )}
                          </Space>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          {item.choosenConfiguration.selectedToppings.length >
                            0 && (
                            <Text type="secondary">
                              Toppings:{" "}
                              {item.choosenConfiguration.selectedToppings
                                .map((topping) => topping.name)
                                .join(", ")}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                    <Space direction="vertical" align="end">
                      <Text strong style={{ fontSize: "16px" }}>
                        Qty: {item.qty}
                      </Text>
                      {/* <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                        ₹{calculateItemTotal(item)}
                      </Text> */}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Customer & Payment Details */}
          <Col xs={24} lg={10}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Customer Information */}
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <Title level={4} style={{ margin: 0 }}>
                      Customer Details
                    </Title>
                  </Space>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Name">
                    <Text strong>
                      {/* {orders.customerId.firstName} {orders.customerId.lastName} */}
                      Kunal Kharat
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer ID">
                    <Text code>{orders.customerId._id}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Delivery Address */}
              <Card
                title={
                  <Space>
                    <HomeOutlined />
                    <Title level={4} style={{ margin: 0 }}>
                      Delivery Address
                    </Title>
                  </Space>
                }
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Tag color="blue">{orders.address.label}</Tag>
                  <Text style={{ textTransform: "capitalize" }}>{orders.address.text}</Text>
                  <Text>
                    <strong>City:</strong> {orders.address.city}
                  </Text>
                  <Text>
                    <strong>Postal Code:</strong> {orders.address.postalCode}
                  </Text>
                  <Text>
                    <PhoneOutlined style={{ marginRight: 8 }} />
                    {orders.address.phone}
                  </Text>
                </Space>
              </Card>

              {/* Payment Information */}
              <Card
                title={
                  <Space>
                    <CreditCardOutlined />
                    <Title level={4} style={{ margin: 0 }}>
                      Payment Details
                    </Title>
                  </Space>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Payment Mode">
                    <Space>
                      {getPaymentModeIcon(orders.paymentMode)}
                      <Text strong style={{ textTransform: "capitalize" }}>
                        {orders.paymentMode === PaymentMode.CASH ? "cash on delivery":"card"}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Status">
                    <Tag color={getPaymentStatusColor(orders.paymentStatus)}>
                      {orders.paymentStatus?.charAt(0).toUpperCase() +
                        orders.paymentStatus?.slice(1)}
                    </Tag>
                  </Descriptions.Item>
            
                </Descriptions>
              </Card>

              {/* Special Instructions */}
              {orders.comment && (
                <Card
                  title={
                    <Space>
                      <MessageOutlined />
                      <Title level={4} style={{ margin: 0 }}>
                        Special Instructions
                      </Title>
                    </Space>
                  }
                >
                  <Text
                    style={{
                      fontStyle: "italic",
                      padding: "12px",
                      backgroundColor: "#f6f8fa",
                      borderRadius: "6px",
                      display: "block",
                    }}
                  >
                    "{orders.comment}"
                  </Text>
                </Card>
              )}
            </Space>
          </Col>
        </Row>
      </Layout>
    </Space>
  );
};

export default SingleOrderPage;
