import { Card, Col, Input, Row, Space, Grid } from "antd";

const { useBreakpoint } = Grid;

interface RestautantsFilterProps {
  children?: React.ReactNode;
  onFilterChange: (FilterName: string, FilterValue: string) => void;
}

const RestaurantsFilter = ({
  onFilterChange,
  children,
}: RestautantsFilterProps) => {
  const screens = useBreakpoint();

  return (
    <>
      <Card>
        <Row justify="space-between" gutter={[16, 16]} wrap>
          <Col xs={24} sm={24} md={16} lg={16}>
            <Space
              size={screens.xs ? "small" : "middle"}
              wrap
              direction={screens.xs ? "vertical" : "horizontal"}
              style={{ width: "100%" }}
            >
              <Input.Search
                style={{ width: screens.xs ? "100%" : 300 }}
                onChange={(e) => onFilterChange("Input Search", e.target.value)}
                placeholder="Search Restaurants"
                allowClear
              />
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

export default RestaurantsFilter;
