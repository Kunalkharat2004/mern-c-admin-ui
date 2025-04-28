import { DeleteOutlined, EditOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { Breadcrumb, Button, Form, Grid, Image, Space, Table, Tag,Typography } from "antd"
import { NavLink } from "react-router-dom";
import ProductsFilter from "./ProductsFilter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../http/api";
import { useState } from "react";
import { Products } from "../../types";
import { format } from "date-fns";

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

  const getColumns = (screens: Record<string, boolean>) => [
    {
      title: "Name",
      dataIndex: "name",
      width: screens.xs ? 150 : "30%",
      ellipsis: true,
      render: (text: string, record: Products) => {
          return <>
          <Image
            src={record.image}
            fallback="https://via.placeholder.com/150"
            preview={false}
            alt={text}
            style={{
              width: screens.xs ? 50 : 100,
              height: screens.xs ? 50 : 100,
              objectFit: "cover",
              borderRadius: "8px",
              marginRight: screens.xs ? "8px" : "16px",
            }}
          />
          <Typography.Text>{text}</Typography.Text>
          </>
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      width: screens.xs ? 150 : "15%",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: screens.xs ? 100 : "15%",
      ellipsis: true,
      render:(_:string, record:Products) => {
          return <>{record.category?.name}</>
      }
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      width: screens.xs ? 100 : "15%",
      ellipsis: true,
      render: (_:boolean, record:Products) =>{
        return<>{record.isPublished ? <Tag color="green">Published</Tag> : <Tag color="red">Draft</Tag>}</>
      }
    },
  
   {
    title: "Created At",
    dataIndex: "createdAt",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
    render: (text: string) => {
      return <Typography.Text>{format(new Date(text),"dd/MM/yyyy HH:MM")}</Typography.Text>;
    },
  },
  ];
  

const ProductsPage = () => {

    const screens = useBreakpoint();
  const [formfilter] = Form.useForm();

  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: 5,
  });

  const getProducts = async()=>{
    const queryString = "currentPage=1&perPage=100";
    const {data} = await getAllProducts(queryString);
    return data;
  }

  const {
    data: products,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    // queryKey: ["users", queryParams],
    queryKey: ["products"],
    queryFn: getProducts,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  console.log("Products",products);

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

        <div
          className="table-container"
          style={{ width: "100%", overflowX: "auto", maxWidth: "100vw" }}
        >
          <Table
            rowKey={"id"}
            columns={[
              ...getColumns(screens),
              // {
              //   title: "Action",
              //   dataIndex: "action",
              //   width: screens.xs ? 100 : "15%",
              //   ellipsis: true,
              //   render: (_: string, record: User) => {
              //     return (
              //       <Space>
              //         <Button
              //           type="link"
              //           icon={<EditOutlined />}
              //           onClick={() => {
              //             setEditUser(record);
              //           }}
              //         />
              //         <Button
              //           type="link"
              //           onClick={() => showDeleteModal(record)}
              //           icon={<DeleteOutlined />}
              //         />
              //       </Space>
              //     );
              //   },
              // },
            ]}
            dataSource={products?.data}
            loading={isFetching}
            scroll={{
              x: screens.xs ? 550 : "100%",
              scrollToFirstRowOnChange: true,
            }}
            style={{
              minWidth: screens.xs ? 550 : "auto",
              whiteSpace: "nowrap",
            }}
            pagination={{
              current: queryParams.currentPage,
              pageSize: queryParams.perPage,
              total: products?.total,
              onChange: (page) => {
                setQueryParams((prev) => {
                  return {
                    ...prev,
                    currentPage: page,
                  };
                });
              },
              size: screens.xs ? "small" : ("default" as const),
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total}`,
              showQuickJumper: !screens.xs,
              style: {
                marginTop: screens.xs ? "8px" : "16px",
              },
            }}
            size={screens.xs ? "small" : ("middle" as const)}
          />
        </div>
        </Space>
    </>
  )
}

export default ProductsPage