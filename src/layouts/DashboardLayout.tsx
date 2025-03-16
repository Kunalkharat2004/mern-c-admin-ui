import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"
import { Button, Layout, Menu, theme } from "antd";
import Icon,{ HomeFilled, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import MenuIcon from "../components/icons/MenuIcon";
import SalesIcon from "../components/icons/SalesIcon";
import PromosIcon from "../components/icons/PromosIcon";
import OrdersIcon from "../components/icons/OrdersIcon";
import Logo from "../components/icons/Logo";
import CollapaseLogo from "../components/icons/CollapaseLogo";
const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {user} = useAuthStore();
  if(user === null){
    return <Navigate to="/auth/login"/>
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
    <Layout
    style={{
      minHeight: '100vh'
    }}
    >
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div style={{
          height: 64,
          padding: "20px 30px",
          background: colorBgContainer,
          // display: `${collapsed ? 'none' : 'flex'}`
        }}
        >
          {collapsed?<CollapaseLogo/>:<Logo/>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['/']}
          style={{
            background: colorBgContainer,
            paddingTop: "16px",
          }}
          items={[
            {
              key: '/',
              icon: <HomeFilled />,
              label: <NavLink to="/">Home</NavLink>,
            },
            {
              key: '/users',
              icon: <UserOutlined />,
              label: <NavLink to="/users">Users</NavLink>,
            },
            {
              key: '/menu',
              icon: <Icon component={MenuIcon}/>,
              label: <NavLink to="/menu">Menu</NavLink>,
            },
            {
              key: '/orders',
              icon: <Icon component={OrdersIcon}/>,
              label: <NavLink to="/orders">Orders</NavLink>,
            },
            {
              key: '/sales',
              icon: <Icon component={SalesIcon} />,
              label: <NavLink to="/sales">Sales</NavLink>,
            },
            {
              key: '/promos',
              icon: <Icon component={PromosIcon} />,
              label: <NavLink to="/promos">Promos</NavLink>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
    <Outlet/>
          
        </Content>
      </Layout>
    </Layout>
    </>
  )
} 

export default DashboardLayout;