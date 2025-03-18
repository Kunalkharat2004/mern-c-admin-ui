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

const HomePage = () => {
  const { user } = useAuthStore();
  const renderOverlayIcons = useOverlayIcons();

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
            marginBottom: 40,
          }}
          level={3}
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
          <Row>
            <Col span={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card variant="borderless">
                    <Statistic
                      title={
                        <Space align="center" size="middle">
                          {renderOverlayIcons(OrdersRectangle, OrdersCardIcon)}
                          <Title level={4}>Total Orders</Title>
                        </Space>
                      }
                      value={28}
                      valueStyle={{
                        marginLeft: 60,
                        fontSize: "2.2rem",
                      }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card variant="borderless">
                    <Statistic
                      title={
                        <Space align="center" size="middle">
                          {renderOverlayIcons(SalesRectangle, SalesCardIcon)}
                          <Title level={4}>Total Sales</Title>
                        </Space>
                      }
                      value={"50,000"}
                      valueStyle={{
                        marginLeft: 60,
                        fontSize: "2.2rem",
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
                  height: 400,
                }}
              >
                <Space align="center">
                  <SalesIcon />
                  <Title level={4}>Sales</Title>
                </Space>
                <Divider
                  style={{
                    marginTop: 0,
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={{
                  height: "auto",
                  marginLeft: "16px",
                }}
              >
                <Flex gap="large" vertical>
                  <div>
                    <Space align="center">
                      {renderOverlayIcons(
                        RecentOrderRectangle,
                        RecentOrderIcon
                      )}
                      <Title level={4}>Recent Orders</Title>
                    </Space>
                    <Divider
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    />
                  </div>
                  <Flex gap="middle" vertical>
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
