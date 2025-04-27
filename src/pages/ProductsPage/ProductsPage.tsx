import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import { Breadcrumb, Button, Form, Grid, Space } from "antd"
import { NavLink } from "react-router-dom";
import ProductsFilter from "./ProductsFilter";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
    {
      title: <NavLink to="/">Dashboard</NavLink>,
    },
    {
      title: "Products",
      link: "/products",
    },
  ];

const ProductsPage = () => {

    const screens = useBreakpoint();
  const [formfilter] = Form.useForm();

  return (
    <>
        <Space
         direction="vertical"
         size={screens.xs ? "middle" : "large"}
         style={{ width: "100%", overflow: "visible" }}
        >
        <Breadcrumb
          separator={<RightOutlined />}
          items={BreadcrumbItems}
          style={{
            fontSize: screens.xs ? "12px" : "14px",
            marginBottom: screens.xs ? "8px" : "16px",
          }}
        />

    <Form form={formfilter} >
          <ProductsFilter
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {}}
              style={{
                width: screens.xs ? "100%" : "auto",
                marginTop: screens.xs ? "8px" : "0",
              }}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
        
        </Space>
    </>
  )
}

export default ProductsPage