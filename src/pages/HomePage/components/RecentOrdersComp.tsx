import { Row, Col, Space, Typography } from "antd";
import CustomBadge from "../../../hooks/Icons/useCustomBadge";

const { Title } = Typography;

interface RecentOrdersCompProps {
  customerName: string;
  customerAddress: string;
  orderAmount: number;
  status: string;
}

const RecentOrdersComp = ({
  customerName,
  customerAddress,
  orderAmount,
  status,
}: RecentOrdersCompProps) => {
  return (
    <Row
      align="middle"
      justify="space-between"
      style={{
        padding: "8px 10px",
        border: "1px solid #f0f0f0",
        borderRadius: 4,
        marginBottom: 8, // just for spacing between items
      }}
    >
      {/* 1) Name & Address */}
      <Col
        style={{
          width: 200, // fixed width for the first column
          overflow: "hidden", // optional: hide text overflow if too long
        }}
      >
        <Space direction="vertical" size={0}>
          <Title
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {customerName}
          </Title>
          <Title
            level={5}
            style={{
              fontSize: "0.95rem",
              fontWeight: 400,
              margin: 0,
              color: "#555",
            }}
          >
            {customerAddress}
          </Title>
        </Space>
      </Col>

      {/* 2) Order Amount */}
      <Col
        style={{
          width: 100, // fixed width for the second column
          textAlign: "right", // align text to the right
        }}
      >
        <Title
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            margin: 0,
          }}
        >
          ₹ {orderAmount}
        </Title>
      </Col>

      {/* 3) Status Badge */}
      <Col
        style={{
          width: 100, // fixed width for the third column
          textAlign: "right", // align the badge to the right
        }}
      >
        <CustomBadge label={status} />
      </Col>
    </Row>
  );
};

export default RecentOrdersComp;
