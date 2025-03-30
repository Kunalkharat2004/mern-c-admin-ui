import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Grid } from "antd";
import { getAllTenants } from "../../http/api";
import { Tenant } from "../../types";
import TextArea from "antd/es/input/TextArea";

const { useBreakpoint } = Grid;

const UserForm = () => {
  const screens = useBreakpoint();

  const getTenants = async () => {
    const { data } = await getAllTenants();
    return data;
  };

  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });

  return (
    <>
      <Space
        direction="vertical"
        size={screens.xs ? "middle" : "large"}
        style={{ width: "100%" }}
      >
        <Card title="Basic Info">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please input your first name!",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
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
                <Input allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Security Info">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
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
                  {
                    pattern: new RegExp(
                      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
                    ),
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter and one number!",
                  },
                ]}
              >
                <Input.Password allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                  {
                    pattern: new RegExp(
                      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
                    ),
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter and one number!",
                  },
                  // Custom validator to check if passwords match
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Role Info">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select a role!",
                  },
                ]}
              >
                <Select placeholder="Select Role">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item noStyle dependencies={["role"]}>
                {({ getFieldValue }) =>
                  getFieldValue("role") === "manager" ? (
                    <Form.Item
                      label="Restaurant"
                      name="tenantId"
                      rules={[
                        {
                          required: true,
                          message: "Please select a restaurant!",
                        },
                      ]}
                    >
                      <Select placeholder="Select Restaurant">
                        {tenants?.map((tenant: Tenant) => (
                          <Select.Option key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Address Info">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Address is required!",
                  },
                ]}
              >
                <TextArea rows={screens.xs ? 3 : 4} allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Space>
    </>
  );
};

export default UserForm;
