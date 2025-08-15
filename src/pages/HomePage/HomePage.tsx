import {
  Card,
  Col,
  Divider,
  Flex,
  Layout,
  Row,
  Space,
  Statistic,
  Typography,
  Grid,
  Tag,
} from "antd";
import { useAuthStore } from "../../store";
import useOverlayIcons from "../../hooks/Icons/useSetIcons";
import SalesIcon from "../../assets/Icons/Sidebar/SalesIcon";
import RecentOrdersComp from "./components/RecentOrdersComp";
import { NavLink } from "react-router-dom";
import OrdersRectangle from "./Icons/OrdersRectangle";
import OrdersCardIcon from "./Icons/OrdersCardIcon";
import SalesRectangle from "./Icons/SalesRectangle";
import SalesCardIcon from "./Icons/SalesCardIcon";
import RecentOrderRectangle from "./Icons/RecentOrderRectangle";
import RecentOrderIcon from "./Icons/RecentOrderIcon";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Line,
} from "recharts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrdersForDashBoard } from "../../http/api";
import { OrderType } from "../../types/order";
import RecentOrdersSkeleton from "./components/RecentOrderSkeleton";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const HomePage = () => {
  const { user } = useAuthStore();
  const renderOverlayIcons = useOverlayIcons();
  const screens = useBreakpoint();

  const COLORS = ["#1677ff", "#52c41a", "#efde28ff", "#a421f0ff", "#ef730dff"];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  const queryParams = {
    page: 1,
    limit: 4,
  };
  const getAllOrders = async () => {
    const filteredValues = Object.fromEntries(
      Object.entries(queryParams).filter((item) => !!item[1])
    );
    const queryParamasString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getOrdersForDashBoard(queryParamasString);
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

  return (
    <>
      <Layout
        style={{
          height: "100%",
        }}
      >
        <Title
          style={{
            marginBottom: screens.xs ? 20 : 40,
            fontSize: screens.xs ? "1.5rem" : undefined,
          }}
          level={screens.xs ? 4 : 3}
        >
          {getGreeting()}
          <br />
          {user?.firstName} 😊
        </Title>
        <Layout
          style={{
            height: "100%",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card variant="borderless">
                    <Statistic
                      title={
                        <Space
                          align="center"
                          size={screens.xs ? "small" : "middle"}
                        >
                          {renderOverlayIcons(OrdersRectangle, OrdersCardIcon)}
                          <Title level={screens.xs ? 5 : 4}>Total Orders</Title>
                        </Space>
                      }
                      value={orders?.total || 0}
                      valueStyle={{
                        marginBottom: screens.xs ? 5 : 10,
                        fontSize: screens.xs ? "1.8rem" : "2.2rem",
                      }}
                    />
                    <Space size="small">
                      <Tag hidden></Tag>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card variant="borderless">
                    <Statistic
                      title={
                        <Space
                          align="center"
                          size={screens.xs ? "small" : "middle"}
                        >
                          {renderOverlayIcons(SalesRectangle, SalesCardIcon)}
                          <Title level={screens.xs ? 5 : 4}>Total Sales</Title>
                        </Space>
                      }
                      value={orders?.totalSales || 0}
                      valueStyle={{
                        marginBottom: screens.xs ? 5 : 10,
                        fontSize: screens.xs ? "1.8rem" : "2.2rem",
                      }}
                      prefix="₹"
                    />
                    <Space size="small">
                      {/* <Tag color="green">+9.4% MoM</Tag> */}
                      <Tag>Avg Order: ₹ {orders?.avgOrderPrice || 0}</Tag>
                    </Space>
                  </Card>
                </Col>
              </Row>

              <Card
                style={{
                  marginTop: 20,
                  width: "100%",
                  // height: screens.xs ? 300 : 400,
                }}
              >
                <Space align="center">
                  {renderOverlayIcons(OrdersRectangle, OrdersCardIcon)}
                  <Title level={screens.xs ? 5 : 4}>Orders by Status</Title>
                </Space>
                <Divider style={{ marginTop: 0 }} />
                <ResponsiveContainer
                  width="100%"
                  height={screens.xs ? 240 : 280}
                >
                  <PieChart>
                    <Pie
                      data={orders?.orderStatusCounts || []}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      label
                    >
                      {orders?.orderStatusCounts.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            {isPending ? (
              <RecentOrdersSkeleton />
            ) : (
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Card
                  style={{
                    height: "auto",
                    marginLeft: screens.lg ? "16px" : "0",
                    marginTop: screens.lg ? "0" : "16px",
                  }}
                >
                  <Flex gap={screens.xs ? "middle" : "large"} vertical>
                    <div>
                      <Space
                        align="center"
                        size={screens.xs ? "small" : "middle"}
                      >
                        {renderOverlayIcons(
                          RecentOrderRectangle,
                          RecentOrderIcon
                        )}
                        <Title level={screens.xs ? 5 : 4}>Recent Orders</Title>
                      </Space>
                      <Divider
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      />
                    </div>
                    <Flex gap={screens.xs ? "small" : "middle"} vertical>
                      {orders?.data.map((order: OrderType) => (
                        <RecentOrdersComp
                          customerName={order.customerId!.firstName!}
                          customerAddress={order.address.text}
                          orderAmount={order.total}
                          status={order.orderStatus}
                          key={order._id}
                        />
                      ))}
                    </Flex>
                    <div>
                      <NavLink to="/orders">See all orders</NavLink>
                    </div>
                  </Flex>
                </Card>
              </Col>
            )}
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Card
              style={{
                marginTop: "16px",
                width: "100%",
                height: "auto",
              }}
            >
              <Space align="center">
                <SalesIcon />
                <Title level={screens.xs ? 5 : 4}>Sales</Title>
              </Space>
              <Divider
                style={{
                  marginTop: 0,
                }}
              />
              <ResponsiveContainer width="100%" height={screens.xs ? 220 : 300}>
                <AreaChart
                  data={orders?.monthlySalesData || []}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.7} />
                      <stop
                        offset="95%"
                        stopColor="#1677ff"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />

                  {/* ✅ Dynamic tooltip per series */}
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "Revenue") {
                        return [`₹${value}`, "Revenue"];
                      }
                      if (name === "Orders") {
                        return [value, "Orders"]; // No ₹ sign here
                      }
                      return value;
                    }}
                  />

                  <Legend verticalAlign="top" height={24} />

                  {/* Revenue as Area */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#1677ff"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />

                  {/* Orders as Line */}
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#52c41a"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="orders" // optional: separate axis if orders scale is very different
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Row>
        </Layout>
      </Layout>
    </>
  );
};

export default HomePage;
