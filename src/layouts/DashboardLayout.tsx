import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
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
import {
  BellFilled,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import Loader from "../assets/Icons/common/Loader";
import Logo from "../assets/Icons/common/Logo";
import CollapaseLogo from "../assets/Icons/Sidebar/CollapaseLogo";
import {
  MdHome,
  MdRestaurant,
  MdShoppingCart,
  MdAttachMoney,
  MdLocalOffer,
  MdPeople,
  MdOutlineShoppingBasket,
} from "react-icons/md";
import { LuPyramid } from "react-icons/lu";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const DashboardLayout = () => {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const location = useLocation();


  const handleLogout = async()=>{
    setIsLogoutClicked(true);
    await logout();
  }
  const { logout: logoutFromStore } = useAuthStore();
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: handleLogout,
    onSuccess: async () => {
      logoutFromStore();
      return;
    },
  });

  const {
    token: { colorBgContainer, colorPrimary },
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
    return isLogoutClicked
    ? <Navigate to={`/auth/login?returnTo=${"/"}`} />
    :<Navigate to={`/auth/login?returnTo=${location.pathname}`} />;
  }

  const items = [
    {
      key: "/",
      icon: (
        <MdHome
          size={22}
          color={location.pathname === "/" ? colorPrimary : "#838181"}
        />
      ),
      label: (
        <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
          Home
        </NavLink>
      ),
    },
    {
      key: "/products",
      icon: (
        <MdOutlineShoppingBasket
          size={22}
          color={location.pathname === "/products" ? colorPrimary : "#838181"}
        />
      ),
      label: (
        <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
          Products
        </NavLink>
      ),
    },
    {
      key: "/toppings",
      icon: (
        <LuPyramid 
        size={22}
          color={location.pathname === "/toppings" ? colorPrimary : "#838181"}
        />
      ),
      label: (
        <NavLink to="/toppings" onClick={() => setMobileMenuOpen(false)}>
          Toppings
        </NavLink>
      ),
    },
    {
      key: "/orders",
      icon: (
        <MdShoppingCart
          size={22}
          color={location.pathname === "/orders" ? colorPrimary : "#838181"}
        />
      ),
      label: (
        <NavLink to="/orders" onClick={() => setMobileMenuOpen(false)}>
          Orders
        </NavLink>
      ),
    },
    {
      key: "/promos",
      icon: (
        <MdLocalOffer
          size={22}
          color={location.pathname === "/promos" ? colorPrimary : "#838181"}
        />
      ),
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
      icon: (
        <MdPeople
          size={22}
          color={location.pathname === "/users" ? colorPrimary : "#838181"}
        />
      ),
      label: (
        <NavLink to="/users" onClick={() => setMobileMenuOpen(false)}>
          Users
        </NavLink>
      ),
    });

    items.splice(2,0,  {
      key: "/restaurants",
      icon: (
        <MdRestaurant
          size={22}
          color={
            location.pathname === "/restaurants" ? colorPrimary : "#838181"
          }
        />
      ),
      label: (
        <NavLink to="/restaurants" onClick={() => setMobileMenuOpen(false)}>
          Restaurants
        </NavLink>
      ),
    },)
  }

  if (isPending) {
    return <Loader />;
  }

  const renderMenu = () => (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={["/"]}
      selectedKeys={[location.pathname]}
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
                  text={
                    user.role === "admin" ? "Admin" : user.tenant?.name ?? ""
                  }
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
