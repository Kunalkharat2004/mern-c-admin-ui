import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, Layout, Space, Grid } from "antd";
import Logo from "../../assets/Icons/common/Logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Credentials } from "../../types";
import { login, logout, self } from "../../http/api";
import { useAuthStore } from "../../store";
import { usePermission } from "../../hooks/usePermission";

const { useBreakpoint } = Grid;

const LoginPage = () => {
  const screens = useBreakpoint();
  const { isAllowed } = usePermission();
  const { setUser, logout: logoutFromStore } = useAuthStore();
  const loginUser = async (credentials: Credentials) => {
    const { data } = await login(credentials);
    return data;
  };

  const getSelf = async () => {
    const { data } = await self();
    return data;
  };

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const { data: userData } = await refetch();
      if (!isAllowed(userData)) {
        logout();
        logoutFromStore();
        return;
      }
      setUser(userData);
    },
  });

  return (
    <>
      <Layout
        style={{ display: "grid", placeItems: "center", height: "100vh" }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{
            width: "100%",
            alignItems: "center",
            padding: screens.xs ? "0 16px" : 0,
          }}
        >
          <Layout.Content style={{ textAlign: "center" }}>
            <Logo />
          </Layout.Content>
          <Card
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: screens.xs ? 18 : 20,
                  justifyContent: "center",
                }}
              >
                <LockOutlined />
                <span>Sign in</span>
              </Space>
            }
            variant="borderless"
            style={{
              width: screens.xs ? "100%" : screens.sm ? 350 : 400,
              maxWidth: "100%",
            }}
          >
            <Form
              initialValues={{ remember: true }}
              layout="vertical"
              onFinish={(values) => {
                mutate({
                  email: values.email,
                  password: values.password,
                });
              }}
              style={{ width: "100%" }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },

                  {
                    type: "email",
                    message: "Please input a valid email!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item label={null}>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: screens.xs ? "center" : "space-between",
                    flexDirection: screens.xs ? "column" : "row",
                    alignItems: "center",
                    gap: screens.xs ? "8px" : "0",
                  }}
                >
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    label={null}
                    style={{ margin: 0 }}
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="#">Forgot password?</a>
                </Space>
              </Form.Item>

              <Form.Item label={null}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  size={screens.xs ? "large" : "middle"}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
