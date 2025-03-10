import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, Layout, Space } from "antd";
import Logo from "../../components/icons/Logo";

const LoginPage = () => {
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
