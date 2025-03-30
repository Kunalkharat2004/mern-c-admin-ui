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
} from "antd";
import { useAuthStore } from "../../store";
import useOverlayIcons from "../../hooks/Icons/useSetIcons";
import SalesIcon from "../../assets/Icons/Sidebar/SalesIcon";
import RecentOrdersComp from "./components/RecentOrdersComp";
import { recentOrder } from "../../data/recentOrders";
import { NavLink } from "react-router-dom";
import OrdersRectangle from "./Icons/OrdersRectangle";
import OrdersCardIcon from "./Icons/OrdersCardIcon";
import SalesRectangle from "./Icons/SalesRectangle";
import SalesCardIcon from "./Icons/SalesCardIcon";
import RecentOrderRectangle from "./Icons/RecentOrderRectangle";
import RecentOrderIcon from "./Icons/RecentOrderIcon";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const HomePage = () => {
  const { user } = useAuthStore();
  const renderOverlayIcons = useOverlayIcons();
  const screens = useBreakpoint();

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
                      value={28}
                      valueStyle={{
                        marginLeft: screens.xs ? 40 : 60,
                        fontSize: screens.xs ? "1.8rem" : "2.2rem",
                      }}
                    />
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
                      value={"50,000"}
                      valueStyle={{
                        marginLeft: screens.xs ? 40 : 60,
                        fontSize: screens.xs ? "1.8rem" : "2.2rem",
                      }}
                      prefix="₹"
                    />
                  </Card>
                </Col>
              </Row>
              <Card
                style={{
                  marginTop: 20,
                  width: "100%",
                  height: screens.xs ? 300 : 400,
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
              </Card>
            </Col>
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
                    {recentOrder.map((order) => (
                      <RecentOrdersComp
                        customerName={order.customerName}
                        customerAddress={order.customerAddress}
                        orderAmount={order.orderAmount}
                        status={order.status}
                        key={order.key}
                      />
                    ))}
                  </Flex>
                  <div>
                    <NavLink to="#">See all orders</NavLink>
                  </div>
                </Flex>
              </Card>
            </Col>
          </Row>
        </Layout>
      </Layout>
    </>
  );
};

export default HomePage;
