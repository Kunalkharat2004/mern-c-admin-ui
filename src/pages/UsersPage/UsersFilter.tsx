import { Card, Col, Input, Row, Select, Space, Grid, Form } from "antd";

const { useBreakpoint } = Grid;

interface UsersFilterProps {
  children?: React.ReactNode;
  onFilterChange: (FilterName: string, FilterValue: string) => void;
}

const UsersFilter = ({ onFilterChange, children }: UsersFilterProps) => {
  const screens = useBreakpoint();

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
              <Form.Item name="q">
                <Input.Search
                  onChange={(e) =>
                    onFilterChange("Input Search", e.target.value)
                  }
                  placeholder="Search Users"
                  allowClear
                  style={{ width: screens.xs ? "100%" : "auto" }}
                />
              </Form.Item>

              <Form.Item name="role">
                <Select
                  placeholder="Select Role"
                  style={{ width: screens.xs ? "100%" : 150 }}
                  onChange={(value) => onFilterChange("Select Role", value)}
                  allowClear
                >
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
                </Select>

              </Form.Item>
              <Form.Item name="status">
                <Select
                  placeholder="Select Status"
                  style={{ width: screens.xs ? "100%" : 150 }}
                  onChange={(value) => onFilterChange("Select Status", value)}
                >
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="banned">Banned</Select.Option>
                </Select>
              </Form.Item>

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

export default UsersFilter;
