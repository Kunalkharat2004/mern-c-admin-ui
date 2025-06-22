import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Grid } from "antd";
import { getAllTenants } from "../../http/api";
import { Tenant, User } from "../../types";
import { useMemo, useState } from "react";
import { debounce } from "lodash";

const { useBreakpoint } = Grid;

interface QueryParams {
  page: number;
  limit: number;
  q?: string;
}

interface UserFormProps {
  isEditMode?: boolean;
  initialValues?: User;
}

const UserForm = ({ isEditMode = false, initialValues }: UserFormProps) => {
  const screens = useBreakpoint();
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 5,
  });

  const getTenants = async () => {
    const params = { ...queryParams };
    if (!params.q) {
      delete params.q;
    }

    const queryString = new URLSearchParams(
      params as unknown as Record<string, string>
    ).toString();

    const { data } = await getAllTenants(queryString);

    if (
      isEditMode &&
      initialValues?.tenant &&
      !data.data.find((t: Tenant) => t.id === initialValues.tenant?.id)
    ) {
      data.data = [initialValues.tenant, ...data.data];
    }

    return data;
  };

  const { data: tenants } = useQuery({
    queryKey: ["tenants", queryParams, initialValues?.tenant?.id],
    queryFn: getTenants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        q: value || undefined,
        page: 1,
      }));
    }, 500);
  }, []);

  const handleSearch = (value: string) => {
    if (value.trim() !== "") {
      debounceQUpdate(value);
    } else {
      setQueryParams((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { q, ...rest } = prev;
        return {
          ...rest,
          page: 1,
        };
      });
    }
  };

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
                initialValue={initialValues?.firstName}
                rules={[
                  {
                    required: true,
                    message: "Please input first name!",
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
                initialValue={initialValues?.lastName}
                rules={[
                  {
                    required: true,
                    message: "Please input last name!",
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
                initialValue={initialValues?.email}
                rules={[
                  {
                    required: true,
                    message: "Please input email!",
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

        {!isEditMode && (
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
        )}

        <Card title="Role Info">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Role"
                name="role"
                initialValue={initialValues?.role}
                rules={[
                  {
                    required: true,
                    message: "Please select a role!",
                  },
                ]}
              >
                <Select id="update-role" placeholder="Select Role">
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
                      initialValue={initialValues?.tenant?.id}
                      rules={[
                        {
                          required: true,
                          message: "Please select a restaurant!",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select Restaurant"
                        optionFilterProp="children"
                        onSearch={handleSearch}
                        loading={!tenants?.data}
                        allowClear
                        defaultValue={initialValues?.tenant?.id}
                        notFoundContent={
                          tenants?.data?.length === 0
                            ? "No restaurants found"
                            : null
                        }
                        filterOption={(input, option) =>
                          option?.children
                            ? String(option.children)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            : false
                        }
                      >
                        {tenants?.data?.map((tenant: Tenant) => (
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
      </Space>
    </>
  );
};

export default UserForm;
