import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Form,
  Grid,
  Image,
  Result,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { NavLink } from "react-router-dom";
import ProductsFilter from "./ProductsFilter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../http/api";
import { useMemo, useState } from "react";
import { FieldData, Products } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";

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
    width: screens.xs ? "40%" : "30%",
    ellipsis: true,
    render: (text: string, record: Products) => {
      return (
        <Space size="small" align="center">
          <Image
            src={record.image}
            fallback="https://via.placeholder.com/150"
            preview={false}
            alt={text}
            style={{
              width: screens.xs ? 40 : 60,
              height: screens.xs ? 40 : 60,
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <Typography.Text
            ellipsis
            style={{ maxWidth: screens.xs ? 100 : 200 }}
          >
            {text}
          </Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    width: screens.xs ? "30%" : "20%",
    ellipsis: true,
    render: (text: string) => (
      <Typography.Text ellipsis style={{ maxWidth: screens.xs ? 100 : 200 }}>
        {text}
      </Typography.Text>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    width: screens.xs ? "15%" : "15%",
    ellipsis: true,
    render: (_: string, record: Products) => {
      return (
        <Typography.Text ellipsis style={{ maxWidth: screens.xs ? 80 : 150 }}>
          {record.category?.name}
        </Typography.Text>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "isPublished",
    width: screens.xs ? "15%" : "10%",
    ellipsis: true,
    render: (_: boolean, record: Products) => {
      return (
        <>
          {record.isPublished ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: screens.xs ? "30%" : "25%",
    ellipsis: true,
    render: (text: string) => {
      return (
        <Typography.Text ellipsis>
          {format(new Date(text), screens.xs ? "dd/MM/yy" : "dd/MM/yyyy HH:MM")}
        </Typography.Text>
      );
    },
  },
];

const ProductsPage = () => {
  const screens = useBreakpoint();
  const [formfilter] = Form.useForm();

  const {user} = useAuthStore();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    tenantId: user?.role === "manager" ? user.tenant?.id : undefined,
  });

  const getProducts = async () => {
    const filteredValues = Object.fromEntries(
      Object.entries(queryParams).filter((item) => !!item[1])
    );
    const queryParamasString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getAllProducts(queryParamasString);
    return data;
  };

  const {
    data: products,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: getProducts,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        q: value,
        page: 1,
      }));
    }, 500);
  }, []);

  const handleFilterChange = (changedFields: FieldData[]) => {
    // {
    // q: "Peprroni",
    // isPublished: true
    // }
    console.log("Changed fields: ", changedFields);

    const filter = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

    if ("q" in filter) {
      debounceQUpdate(filter.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...filter,
        page: 1,
      }));
    }
  };

  if (isError) {
    return (
      <Result
        status="500"
        title="Something went wrong"
        subTitle="Sorry, we encountered an error while fetching the data."
        extra={[
          <Button type="primary" key="retry" onClick={() => refetch()}>
            Retry
          </Button>,
        ]}
      />
    );
  }

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

        <Form form={formfilter} onFieldsChange={handleFilterChange}>
          <ProductsFilter>
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
          style={{
            width: "100%",
            overflowX: "auto",
            maxWidth: "100vw",
            marginTop: screens.xs ? "8px" : "16px",
          }}
        >
          <Table
            rowKey={"id"}
            columns={getColumns(screens)}
            dataSource={products?.data}
            loading={isFetching}
            scroll={{
              x: screens.xs ? 800 : "100%",
              scrollToFirstRowOnChange: true,
            }}
            style={{
              minWidth: screens.xs ? 800 : "auto",
              whiteSpace: "nowrap",
            }}
            pagination={{
              current: queryParams.page,
              pageSize: queryParams.limit,
              total: products?.total,
              onChange: (page) => {
                setQueryParams((prev) => {
                  return {
                    ...prev,
                    page: page,
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
  );
};

export default ProductsPage;
