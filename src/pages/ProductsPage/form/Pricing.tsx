import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { ICategory } from "../../../types";

type PricingProps = {
  selectedCategory: string | null;
};

const Pricing = ({ selectedCategory }: PricingProps) => {
  const category: ICategory | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;
  console.log("category", category);
  if (!category) return null;
  const b = Object.entries(category?.priceConfiguration);
  console.log("b", b);
  return (
    <Card title="Product Pricing">
      {Object.entries(category?.priceConfiguration).map(
        ([configurationKey, configurationValue]) => {
          return (
            <div key={configurationKey}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Text
                  style={{
                    fontWeight: "500",
                  }}
                >
                  {`${configurationKey} (${configurationValue.priceType})`}
                </Typography.Text>

                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Card>
                    <Row gutter={20}>
                      {(configurationValue.availableOptions as Array<string>).map(
                        (option: string) => {
                          return (
                            <Col span={8} key={option}>
                              <Form.Item
                                label={option}
                                name={[
                                  "priceConfiguration",
                                  JSON.stringify({
                                    configurationKey: configurationKey,
                                    priceType: configurationValue.priceType,
                                  }),
                                  option,
                                ]}
                              >
                                <InputNumber addonAfter="₹" />
                              </Form.Item>
                            </Col>
                          );
                        }
                      )}
                    </Row>
                  </Card>
                </Space>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
