import { Card, Form, Input, Space } from "antd";
import TextArea from "antd/es/input/TextArea";

const RestaurantForm = () => {
  return (
    <Space style={{width:"100%"}} direction="vertical" size="large">
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
          <Input allowClear style={{ width: "80%" }} />
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
            <TextArea rows={6} allowClear style={{ width: "80%" }} />
        </Form.Item>
      </Card>
    </Space>
  );
};

export default RestaurantForm;
