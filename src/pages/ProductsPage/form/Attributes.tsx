import { Card, Col, Form, Radio, Row, Space, Switch } from "antd";
import { ICategory } from "../../../types";

interface AttributesProps {
  selectedCategory: string | null;
}

const Attributes = ({ selectedCategory }: AttributesProps) => {
  const category: ICategory | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;
  if (!category) return null;

  return (
    <Card title="Product Attributes">
      {Object.entries(category?.attributeConfiguration).map(
        ([attributeConfigurationKey, attributeConfigurationValue]) => {
          return (
            <div key={attributeConfigurationKey}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {attributeConfigurationValue.widgetType === "radio" ? (
                 <Row
                 gutter={20}
                 >
                  <Col>
                  <Form.Item
                    label={attributeConfigurationValue.name}
                    name={[
                      "attributeConfiguration",
                      attributeConfigurationValue.name,
                    ]}
                    initialValue={attributeConfigurationValue.defaultValue}
                    rules={[
                      {
                        required: true,
                        message: `${attributeConfigurationValue.name} is required`,
                      },
                    ]}
                  >
                    <Radio.Group>
                      {attributeConfigurationValue.availableOptions.map(
                        (option: string) => {
                          return (
                            <Radio.Button value={option} key={option}>
                              {option}
                            </Radio.Button>
                          );
                        }
                      )}
                    </Radio.Group>
                  </Form.Item>
                  </Col>
                 </Row>
                ) : attributeConfigurationValue.widgetType === "switch" ? (
                  <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label={attributeConfigurationValue.name}
                        name={[
                          "attributeConfiguration",
                          attributeConfigurationValue.name,
                        ]}
                        valuePropName="checked"
                        initialValue={attributeConfigurationValue.defaultValue}
                        rules={[
                          {
                            required: true,
                            message: `${attributeConfigurationValue.name} is required`,
                          },
                        ]}
                      >
                        <Switch
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null}
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Attributes;
