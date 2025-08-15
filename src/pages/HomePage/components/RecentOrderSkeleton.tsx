import { Card, Col, Divider, Flex, Grid, Skeleton, Space } from "antd";
// import { NavLink } from "react-router-dom";

// const { Title } = Typography;
const { useBreakpoint } = Grid;
export default function RecentOrdersSkeleton() {
  const screens = useBreakpoint();

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
      <Card
        style={{
          height: "auto",
          marginLeft: screens.lg ? "16px" : "0",
          marginTop: screens.lg ? "0" : "16px",
        }}
      >
        <Flex gap={screens.xs ? "middle" : "large"} vertical>
          <div>
            <Space align="center" size={screens.xs ? "small" : "middle"}>
              {/* Icon Skeleton */}
              <Skeleton.Avatar active size="large" shape="square" />
              <Skeleton.Input active size={screens.xs ? "small" : "default"} style={{ width: 120 }} />
            </Space>
            <Divider style={{ marginTop: 0, marginBottom: 0 }} />
          </div>

          {/* Multiple Skeleton Items for Orders */}
          <Flex gap={screens.xs ? "small" : "middle"} vertical>
            {Array.from({ length: 3 }).map((_, i) => (
              <Flex key={i} align="center" gap="small">
                <Skeleton.Avatar active size="large" />
                <div style={{ flex: 1 }}>
                  <Skeleton.Input active size="small" style={{ width: "70%", marginBottom: 4 }} />
                  <Skeleton.Input active size="small" style={{ width: "50%" }} />
                </div>
                <Skeleton.Button active size="small" style={{ width: 60 }} />
              </Flex>
            ))}
          </Flex>

          <div>
            <Skeleton.Input active size="small" style={{ width: 100 }} />
          </div>
        </Flex>
      </Card>
    </Col>
  );
}
