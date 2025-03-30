import { Card, Form, Input, Space, Grid } from "antd";
import TextArea from "antd/es/input/TextArea";

const { useBreakpoint } = Grid;

const RestaurantForm = () => {
  const screens = useBreakpoint();

  return (
    <Space
      style={{ width: "100%" }}
      direction="vertical"
      size={screens.xs ? "middle" : "large"}
    >
      <Card style={{ width: "100%" }} title="Basic Info">
        <Form.Item
          label="Restaurant Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input restaurant name!",
            },
          ]}
        >
          <Input allowClear style={{ width: screens.xs ? "100%" : "80%" }} />
        </Form.Item>

        <Form.Item
          label="Restaurant Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please input restaurant address!",
            },
          ]}
        >
          <TextArea
            rows={screens.xs ? 4 : 6}
            allowClear
            style={{ width: screens.xs ? "100%" : "80%" }}
          />
        </Form.Item>
      </Card>
    </Space>
  );
};

export default RestaurantForm;
