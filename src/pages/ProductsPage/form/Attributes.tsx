import { Card, Col, Form, Radio, Row, Space, Switch } from "antd";
import { ICategory } from "../../../types";
import { getSingleCategory } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";

interface AttributesProps {
  selectedCategory: string | null;
}

const Attributes = ({ selectedCategory }: AttributesProps) => {
  const categoryId: string | null = selectedCategory;

  const singleCategory = async () => {
    if (!categoryId) {
      return null;
    }
    const { data } = await getSingleCategory(categoryId);
    return data;
  };

  const { data: category } = useQuery<ICategory>({
    queryKey: ["category", categoryId],
    queryFn: singleCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!category) {
    return <Card title="Product Pricing">No pricing configuration found.</Card>;
  }

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
