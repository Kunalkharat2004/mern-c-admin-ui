import { getAllTenants } from "../../../http/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Form, Grid, Select } from "antd";
import { Tenant } from "../../../types";

const { useBreakpoint } = Grid;

const RestaurantFilter = () => {
  const screens = useBreakpoint();
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
  return (
    <div>
      <Form.Item
        name="tenantId"
        style={{ marginBottom: 0, width: screens.xs ? "100%" : 350 }}
      >
        <Select
          placeholder="Select restaurant"
          style={{ width: screens.xs ? "100%" : 350 }}
          allowClear
        >
          {restaurants?.data?.map((restaurant: Tenant) => (
            <Select.Option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default RestaurantFilter;
