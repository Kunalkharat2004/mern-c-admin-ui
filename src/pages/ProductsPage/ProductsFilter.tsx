import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Form,
  Select,
  Card,
  Space,
  Row,
  Grid,
  Col,
  Input,
  Switch,
  Typography,
} from "antd";
import { getAllCategories, getAllTenants } from "../../http/api";
import { ICategory, Tenant } from "../../types";
import { useAuthStore } from "../../store";

const { useBreakpoint } = Grid;

interface ProductsFilterProps {
  children?: React.ReactNode;
  //   onFilterChange: (FilterName: string, FilterValue: string) => void;
}

const ProductsFilter = ({ children }: ProductsFilterProps) => {
  console.log("ProductsFilter rendered");
  const screens = useBreakpoint();

  const getCategories = async () => {
    const { data } = await getAllCategories();
    return data;
  };

  const getRestaurants = async () => {
    const { data } = await getAllTenants(`page=1&limit=100`);
    return data;
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const { user } = useAuthStore();
  return (
    <>
      <Card>
        <Row gutter={[16, 16]} justify="space-between" wrap>
          <Col xs={24} sm={24} md={16} lg={16}>
            <Space
              size={screens.xs ? "small" : "middle"}
              wrap
              direction={screens.xs ? "vertical" : "horizontal"}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="q"
                style={{ marginBottom: 0, width: screens.xs ? "100%" : "auto" }}
              >
                <Input.Search
                  placeholder="Search Product"
                  allowClear
                  style={{ width: screens.xs ? "100%" : "auto" }}
                />
              </Form.Item>

              <Form.Item
                name="categoryId"
                style={{ marginBottom: 0, width: screens.xs ? "100%" : 150 }}
              >
                <Select
                  placeholder="Select Category"
                  style={{ width: screens.xs ? "100%" : 150 }}
                  allowClear
                >
                  {categories?.map((category: ICategory) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {user?.role === "admin" && (
                <Form.Item
                  name="tenantId"
                  style={{ marginBottom: 0, width: screens.xs ? "100%" : 150 }}
                >
                  <Select
                    placeholder="Select restaurant"
                    style={{ width: screens.xs ? "100%" : 150 }}
                    allowClear
                  >
                    {restaurants?.data?.map((restaurant: Tenant) => (
                      <Select.Option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Space
                align="center"
                style={{ width: screens.xs ? "100%" : "auto" }}
              >
                <Form.Item name="isPublished" style={{ marginBottom: 0 }}>
                  <Switch defaultChecked={false} />
                </Form.Item>
                <Typography.Text>Show Published Products</Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            style={{
              display: "flex",
              justifyContent: screens.xs ? "flex-start" : "flex-end",
              marginTop: screens.xs ? "8px" : 0,
            }}
          >
            {children}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ProductsFilter;
