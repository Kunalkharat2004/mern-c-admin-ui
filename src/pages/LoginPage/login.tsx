import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, Layout, Space } from "antd";
import Logo from "../../components/icons/Logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Credentials } from "../../types";
import { login, self } from "../../http/api";
import { useAuthStore } from "../../store";

const LoginPage = () => {
  const { setUser } = useAuthStore();
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
          style={{ width: "100%", alignItems: "center" }}
        >
          <Layout.Content>
            <Logo />
          </Layout.Content>
          <Card
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 20,
                  justifyContent: "center",
                }}
              >
                <LockOutlined />
                <span>Sign in</span>
              </Space>
            }
            variant="borderless"
            style={{ width: 400 }}
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
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    label={null}
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
