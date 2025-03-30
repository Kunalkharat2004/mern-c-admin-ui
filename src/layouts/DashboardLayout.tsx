import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
  Grid,
  Drawer,
} from "antd";
import Icon, {
  BellFilled,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import MenuIcon from "../assets/Icons/Sidebar/MenuIcon";
import SalesIcon from "../assets/Icons/Sidebar/SalesIcon";
import PromosIcon from "../assets/Icons/Sidebar/PromosIcon";
import OrdersIcon from "../assets/Icons/Sidebar/OrdersIcon";
import Logo from "../assets/Icons/common/Logo";
import CollapaseLogo from "../assets/Icons/Sidebar/CollapaseLogo";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import Loader from "../assets/Icons/common/Loader";
import UsersIcon from "../assets/Icons/Sidebar/UsersIcon";
import HomeIcon from "../pages/HomePage/Icons/HomeIcon";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const DashboardLayout = () => {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { logout: logoutFromStore } = useAuthStore();
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFromStore();
      return;
    },
  });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    display: screens.xs ? "none" : "block",
  };

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 1,
    width: "100%",
    padding: "0",
    background: colorBgContainer,
  };

  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" />;
  }

  const items = [
    {
      key: "/",
      icon: <Icon component={HomeIcon} />,
      label: (
        <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
          Home
        </NavLink>
      ),
    },
    {
      key: "/restaurants",
      icon: <Icon component={MenuIcon} />,
      label: (
        <NavLink to="/restaurants" onClick={() => setMobileMenuOpen(false)}>
          Restaurants
        </NavLink>
      ),
    },
    {
      key: "/orders",
      icon: <Icon component={OrdersIcon} />,
      label: (
        <NavLink to="/orders" onClick={() => setMobileMenuOpen(false)}>
          Orders
        </NavLink>
      ),
    },
    {
      key: "/sales",
      icon: <Icon component={SalesIcon} />,
      label: (
        <NavLink to="/sales" onClick={() => setMobileMenuOpen(false)}>
          Sales
        </NavLink>
      ),
    },
    {
      key: "/promos",
      icon: <Icon component={PromosIcon} />,
      label: (
        <NavLink to="/promos" onClick={() => setMobileMenuOpen(false)}>
          Promos
        </NavLink>
      ),
    },
  ];

  if (user.role === "admin") {
    items.splice(1, 0, {
      key: "/users",
      icon: <Icon component={UsersIcon} />,
      label: (
        <NavLink to="/users" onClick={() => setMobileMenuOpen(false)}>
          Users
        </NavLink>
      ),
    });
  }

  if (isPending) {
    return <Loader />;
  }

  const renderMenu = () => (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={["/"]}
      style={{
        background: colorBgContainer,
        paddingTop: "16px",
      }}
      items={items}
    />
  );

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          style={siderStyle}
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div
            style={{
              height: 64,
              padding: "20px 30px",
              background: colorBgContainer,
            }}
          >
            {collapsed ? <CollapaseLogo /> : <Logo />}
          </div>
          {renderMenu()}
        </Sider>
        <Layout>
          <Header style={headerStyle}>
            <Flex
              gap={10}
              justify="space-between"
              style={{ padding: "0 16px" }}
            >
              <Space>
                {screens.xs ? (
                  <Button
                    type="text"
                    icon={<MenuFoldOutlined />}
                    onClick={() => setMobileMenuOpen(true)}
                    style={{
                      fontSize: "16px",
                      width: 64,
                      height: 64,
                    }}
                  />
                ) : (
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: "16px",
                      width: 64,
                      height: 64,
                    }}
                  />
                )}
                <Badge
                  status="success"
                  text={user.role === "admin" ? "Admin" : user.tenant.name}
                />
              </Space>
              <Space>
                <Flex gap="middle" align="start" vertical>
                  <Flex gap={20} align="center" justify="center">
                    <Badge count={5} size="small">
                      <NavLink to="#" style={{ color: "black" }}>
                        <BellFilled style={{ fontSize: "20px" }} />
                      </NavLink>
                    </Badge>
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: [
                          {
                            key: "/logout",
                            label: "Logout",
                            icon: <LogoutOutlined />,
                            onClick: () => logoutMutate(),
                          },
                        ],
                      }}
                      placement="bottomRight"
                    >
                      <Avatar
                        style={{
                          backgroundColor: "#fde3cf",
                          color: "#f56a00",
                          cursor: "pointer",
                        }}
                      >
                        U
                      </Avatar>
                    </Dropdown>
                  </Flex>
                </Flex>
              </Space>
            </Flex>
          </Header>
          <Content
            style={{
              margin: screens.xs ? "8px" : "16px",
              padding: screens.xs ? "12px" : "24px",
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      {screens.xs && (
        <Drawer
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={250}
          bodyStyle={{ padding: 0 }}
        >
          <div
            style={{
              height: 64,
              padding: "20px 30px",
              background: colorBgContainer,
            }}
          >
            <Logo />
          </div>
          {renderMenu()}
        </Drawer>
      )}
    </>
  );
};

export default DashboardLayout;
