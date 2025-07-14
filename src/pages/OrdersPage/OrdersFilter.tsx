import {
  Card,
  Col,
  Form,
  Grid,
  Row,
  Select,
  Space,
} from "antd";
import { getAllTenants } from "../../http/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store";
import { Tenant } from "../../types";
import { OrderStatus, PaymentMode, PaymentStatus } from "../../types/order";

const { useBreakpoint } = Grid;

const OrdersFilter = () => {
  const screens = useBreakpoint();

  const getRestaurants = async () => {
    const { data } = await getAllTenants(`page=1&limit=100`);
    return data;
  };
  const paymentStatus= [PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.FAILED];
  const paymentMode= [PaymentMode.CASH,PaymentMode.CARD];
  const orderStatus= [
    OrderStatus.RECEIVED,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
];

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
  const { user } = useAuthStore();

  return (
    <Card>
      <Row wrap>
        <Col>
          <Space
            size={screens.xs ? "small" : "middle"}
            wrap
            direction={screens.xs ? "vertical" : "horizontal"}
            style={{ width: "100%" }}
          >
            {user?.role === "admin" && (
              <Form.Item
                name="tenantId"
                style={{ marginBottom: 0, width: screens.xs ? "100%" : 200 }}
              >
                <Select
                  placeholder="Select restaurant"
                  style={{ width: screens.xs ? "100%" : 200 }}
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

            <Form.Item
              name="paymentStatus"
              style={{ marginBottom: 0, width: screens.xs ? "100%" : 140 }}
            >
              <Select
                placeholder="Payment status"
                style={{ width: screens.xs ? "100%" : 140 }}
                allowClear
              >
                {paymentStatus.map((option:string) => (
                  <Select.Option key={option} value={option}>
                    {option.charAt(0).toUpperCase()+ option.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="paymentMode"
              style={{ marginBottom: 0, width: screens.xs ? "100%" : 140 }}
            >
              <Select
                placeholder="Payment Mode"
                style={{ width: screens.xs ? "100%" : 140 }}
                allowClear
              >
                {paymentMode.map((option:string) => (
                  <Select.Option key={option} value={option}>
                    {
                        option === "cod"?"Cash On Delivery":"Card"
                    }
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="orderStatus"
              style={{ marginBottom: 0, width: screens.xs ? "100%" : 140 }}
            >
              <Select
                placeholder="Order Status"
                style={{ width: screens.xs ? "100%" : 140 }}
                allowClear
              >
                {orderStatus.map((option:string) => (
                  <Select.Option key={option} value={option}>
                    {option.charAt(0).toUpperCase()+ option.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default OrdersFilter;
