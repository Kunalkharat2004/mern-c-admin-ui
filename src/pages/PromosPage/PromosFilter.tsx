import { Card, Col, Input, Row, Select, Space, Grid, Form } from "antd";
import { useAuthStore } from "../../store";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllTenants } from "../../http/api";
import { Tenant } from "../../types";

const { useBreakpoint } = Grid;

interface PromosFilterProps {
  children?: React.ReactNode;
}

const PromosFilter = ({ children }: PromosFilterProps) => {
  const getRestaurants = async () => {
    const { data } = await getAllTenants(`page=1&limit=100`);
    return data;
  };

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
  const screens = useBreakpoint();
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
                  placeholder="Search Promos"
                  allowClear
                  style={{ width: screens.xs ? "100%" : "auto" }}
                />
              </Form.Item>
              {user?.role === "admin" && (
                <Form.Item
                  name="restaurantId"
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

export default PromosFilter;
