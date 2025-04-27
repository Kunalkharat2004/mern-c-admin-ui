import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Form, Select, Card, Space, Row, Grid, Col, Input, Switch, Typography } from "antd";
import { getAllCategories, getAllTenants } from "../../http/api";
import { ICategory, Tenant } from "../../types";

const { useBreakpoint } = Grid;

interface ProductsFilterProps {
  children?: React.ReactNode;
//   onFilterChange: (FilterName: string, FilterValue: string) => void;
}

const ProductsFilter = ({ children }: ProductsFilterProps) => {
  const screens = useBreakpoint();

  const getCategories = async () =>{
    const {data} = await getAllCategories();
    return data;
  }

  const getRestaurants = async () =>{
    const {data} = await getAllTenants(`currentPage=1&perPage=100`);
    return data;
  }

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });


  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

    
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
                  onChange={(e) =>{}}
                  placeholder="Search Product"
                  allowClear
                  style={{ width: screens.xs ? "100%" : "auto" }}
                />
              </Form.Item>

              <Form.Item name="category">
                <Select
                  placeholder="Select Category"
                  style={{ width: screens.xs ? "100%" : 150 }}
                  onChange={(value) => {}}
                  allowClear
                >
                 {
                    categories?.map((category: ICategory) => (
                        <Select.Option key={category._id} value={category._id}>
                        {category.name}
                        </Select.Option>
                    ))
                 }
                </Select>

              </Form.Item>
              <Form.Item name="restaurant">
                <Select
                  placeholder="Select restaurant"
                  style={{ width: screens.xs ? "100%" : 150 }}
                  onChange={(value) => {}}
                >
                 {
                    restaurants?.data?.map((restaurant: Tenant) => (
                        <Select.Option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                        </Select.Option>
                    ))
                 }
                </Select>
              </Form.Item>

              <Form.Item name="isPublished">
                <Switch 
                    defaultChecked
                    onChange={(value) => {}}
                />
                <Typography.Text style={{ marginLeft: "8px" }}>
                  Show Published Products
                </Typography.Text>
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
  )
}

export default ProductsFilter