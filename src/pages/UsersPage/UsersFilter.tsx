import {  Card, Col, Input, Row, Select, Space } from "antd"

interface UsersFilterProps {
    children?: React.ReactNode;
  onFilterChange: (FilterName:string, FilterValue: string) => void;
}

const UsersFilter = ({ onFilterChange, children }: UsersFilterProps) => {
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
                onChange={(e)=>onFilterChange("Input Search",e.target.value)}
                placeholder="Search Users" allowClear/>

                <Select placeholder="Select Role" style={{width:150}} 
                onChange={(value)=>onFilterChange("Select Role",value)}
                >
                    <Select.Option value="all">All</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="user">User</Select.Option>
                </Select>

                <Select placeholder="Select Status" style={{width:150}}
                onChange={(value)=>onFilterChange("Select Status",value)}
                >
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="banned">Banned</Select.Option>
                </Select>
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

export default UsersFilter