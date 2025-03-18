import {  Card, Col, Input, Row, Space } from "antd"

interface RestautantsFilterProps {
    children?: React.ReactNode;
  onFilterChange: (FilterName:string, FilterValue: string) => void;
}

const RestaurantsFilter = ({ onFilterChange, children }: RestautantsFilterProps) => {
  return (
    <>
          <Card
    >
        <Row justify="space-between">
        <Col span={16}>
            <Space
            size="middle"
            >
                <Input.Search
                style={{width:300}}
                onChange={(e)=>onFilterChange("Input Search",e.target.value)}
                placeholder="Search Restaurants" allowClear/>
            </Space>
        </Col>
        <Col 
        style={{
            display:"flex",
            justifyContent:"flex-end"
        }}
        span={8}>
           {children}
        </Col>
        </Row>
    </Card>
    </>
  )
}

export default RestaurantsFilter