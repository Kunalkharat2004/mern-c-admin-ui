import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, Col, Form, FormInstance, Grid, Input, Row, Select, Space, Switch, Typography } from "antd";
import { getAllCategories, getAllTenants } from "../../../http/api";
import { useMemo, useState } from "react";
import { ICategory, Tenant } from "../../../types";
import { debounce } from "lodash";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImageUpload from "./ProductImageUpload";
import { useAuthStore } from "../../../store";

const { useBreakpoint } = Grid;

interface QueryParams {
  page: number;
  limit: number;
  q?: string;
}

const ProductForm = ({form}:{form: FormInstance}) => {
  const screens = useBreakpoint();
  const initialImage = form.getFieldValue("image") || null;
 
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

    // if (
    //   isEditMode &&
    //   initialValues?.tenant &&
    //   !data.data.find((t: Tenant) => t.id === initialValues.tenant?.id)
    // ) {
    //   data.data = [initialValues.tenant, ...data.data];
    // }

    return data;
  };

  const { data: categories } = useQuery({
    queryKey: ["categories", queryParams],
    queryFn: getAllCategories,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: tenant } = useQuery({
    queryKey: ["tenant", queryParams],
    queryFn: getTenants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
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


  const selectedCategory = Form.useWatch("categoryId");
  const { user} = useAuthStore();

  return (
    <>
      <Space
        direction="vertical"
        size={screens.xs ? "middle" : "large"}
        style={{ width: "100%" }}
      >
        <Card title="Product Info">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Product name is required",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Category"
                name="categoryId"
                rules={[
                  {
                    required: true,
                    message: "Category is required",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Category"
                  optionFilterProp="children"
                  onSearch={handleSearch}
                  loading={!categories?.data}
                  allowClear
                  notFoundContent={
                    categories?.data?.length === 0 ? "No category found" : null
                  }
                  filterOption={(input, option) =>
                    option?.children
                      ? String(option.children)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      : false
                  }
                >
                  {categories?.data.map((category: ICategory) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Description is required",
                  },
                ]}
              >
                <Input.TextArea
                  style={{ resize: "none" }}
                  rows={screens.xs ? 2 : 4}
                  maxLength={200}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Product Image">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <ProductImageUpload initialImage={initialImage} />
            </Col>
          </Row>
        </Card>

        {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
        {selectedCategory && <Attributes selectedCategory={selectedCategory} />}

        {user?.role === "admin" && (
          <Card title="Tenant Info">
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Select Tenant"
                  name="tenantId"
                  rules={[
                    {
                      required: true,
                      message: "Tenant is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    onSearch={handleSearch}
                    loading={!tenant?.data}
                    allowClear
                    notFoundContent={
                      tenant?.data?.length === 0 ? "No tenant found" : null
                    }
                    filterOption={(input, option) =>
                      option?.children
                        ? String(option.children)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        : false
                    }
                  >
                    {tenant?.data.map((item: Tenant) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        <Card title="Other properties">
          <Row>
            <Col>
              <Space>
                <Form.Item name="isPublished" valuePropName="checked">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                  />
                </Form.Item>
                <Typography.Text
                  style={{
                    display: "block",
                    marginBottom: "24px",
                  }}
                >
                  Publish
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Card>
      </Space>
    </>
  );
};

export default ProductForm;
