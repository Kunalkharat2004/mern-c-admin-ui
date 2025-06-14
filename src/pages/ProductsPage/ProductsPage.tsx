import { DeleteOutlined, EditOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Grid,
  Image,
  Modal,
  Result,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { NavLink } from "react-router-dom";
import ProductsFilter from "./ProductsFilter";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProductApi, deleteProduct, getAllProducts, updateProductApi } from "../../http/api";
import { useEffect, useMemo, useState } from "react";
import {
  CreateProductResponse,
  FieldData,
  IAttributeConfigurationValue,
  IPriceConfiguration,
  Products,
} from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./form/ProductForm";
import { useNotification } from "../../context/NotificationContext";
import { makeFormData } from "./helper";

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
          {record.isPublished === true ? (
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
  {

  }
];

const ProductsPage = () => {
  const screens = useBreakpoint();
  const [formfilter] = Form.useForm();
  const [form] = Form.useForm();

  const { user } = useAuthStore();
  const notify = useNotification();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    tenantId: user?.role === "manager" ? user.tenant?.id : undefined,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [productToDelete, setProductToDelete] = useState<Products | null>(null);

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

  
  useEffect(() => {
    if (selectedProduct) {
      setDrawerOpen(true);
      console.log("selectedProduct", selectedProduct);

      // From this:
      // priceConfiguration: {
      //    Crust: {priceType: 'additional', availableOptions: {…}, _id: '6807b94847ee65d529204faa'}
      //    Size: {priceType: 'base', availableOptions: {…}, _id: '6807b94847ee65d529204fa9'}
      // }

      // To this:
      //       priceConfiguration: {
      //            { "configurationKey": "Crust", "priceType": "additional" }: { Thin: 44, Thick: 44 }
      // {"configurationKey":"Size","priceType":"base"}: {Small: 44, Medium: 44, Large: 44}
    // }

      const priceConfiguration = Object.entries(
        selectedProduct.priceConfiguration
      ).reduce((acc, [key, value]) => {
        const stringifiedKey = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType,
        });

        return {
          ...acc,
          [stringifiedKey]: value.availableOptions,
        };
      }, {});

      const attributeConfiguration =
        selectedProduct.attributeConfiguration.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: curr.value,
          };
        }, {});
      
      console.log("priceConfiguration", priceConfiguration);
      console.log("attributeConfiguration", attributeConfiguration);
      
      form.setFieldsValue({
        ...selectedProduct,
        priceConfiguration: priceConfiguration,
        attributeConfiguration: attributeConfiguration,
        categoryId: selectedProduct.category._id,
        })
    }
  }, [selectedProduct, form]);

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

  const createProduct = async (productData: FormData): Promise<CreateProductResponse> => {
    if (selectedProduct) { 
      // edit mode
      const { data } = await updateProductApi(
        productData,
        selectedProduct._id, 
      )
      return data;
    } else {
      const {data} = await createProductApi(productData);
      console.log("data", data);
      return data;
    }
  }

  const queryClient = useQueryClient();
  const { mutate: productMutate, isPending: createProductMutationPending } = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: createProduct,
    onSuccess: () => {
      setDrawerOpen(false);
      form.resetFields();
      notify.success(selectedProduct ? "Product updated successfully" : "Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: () => {
      setDrawerOpen(false);
      form.resetFields();
      notify.error("Something went wrong");
    },
  });

  const handleOnSubmit = async() => {
  
    try {
       await form.validateFields();
      const values = form.getFieldsValue();
      console.log("values", values);

       const priceConfiguration: IPriceConfiguration = Object.entries(
         values.priceConfiguration
       ).reduce((acc: IPriceConfiguration, [key, option]) => {
         const parsedKey = JSON.parse(key);
         const { configurationKey, priceType } = parsedKey;
         acc[configurationKey] = {
           priceType: priceType,
           availableOptions: option as Map<string, number>,
         };

         return acc;
       }, {});

       const attributeConfiguration: IAttributeConfigurationValue[] =
         Object.entries(values.attributeConfiguration).reduce(
           (acc: IAttributeConfigurationValue[], [name, value]) => {
             const obj: IAttributeConfigurationValue = {
               name: name,
               value: value as string,
             };
             acc.push(obj);
             return acc;
           },
           []
        );
      
      const categoryId = values.categoryId;  

      const productData = {
        ...values,
        image: values.image,
        categoryId: categoryId,
        tenantId: user?.role === "manager" ? user.tenant?.id : values.tenantId,
        priceConfiguration: priceConfiguration,
        attributeConfiguration: attributeConfiguration,
        isPublished: values.isPublished ? true : false,
      }
      console.log("productData", productData);
      const formData = makeFormData(productData);
      productMutate(formData);

    } catch (err) {
      console.error("Form validation or submission error:", err);
      notify.error("Something went wrong")
   }
  };

  const handleDeleteProduct = async (id: string | undefined) => {
    if (!id) {
      notify.error("Invalid product ID");
      return;
    }
    try {
      await deleteProduct(id);
      notify.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      notify.error("Something went wrong");
    }
  };

    const showDeleteModal = (product: Products) => {
      setProductToDelete(product);
      setDeleteModalOpen(true);
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
              onClick={() => {
                setDrawerOpen(true);
              }}
              style={{
                width: screens.xs ? "100%" : "auto",
                marginTop: screens.xs ? "8px" : "0",
              }}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>

        <Drawer
          title={selectedProduct ? "Update Product" : "Create Product"}
          maskClosable={true}
          width={screens.xs ? "100%" : 720}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
            setSelectedProduct(null);
            form.resetFields();
          }}
          destroyOnClose={true}
          open={drawerOpen}
          extra={
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  setSelectedProduct(null);
                  notify.info(
                    selectedProduct
                      ? "Product update cancelled"
                      : "Product creation cancelled"
                  );
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOnSubmit}
                loading={createProductMutationPending}
                type="primary"
              >
                {selectedProduct ? "Update" : "Submit"}
              </Button>
            </Space>
          }
          placement={screens.xs ? "bottom" : "right"}
          height={screens.xs ? "80%" : undefined}
        >
          <Form
            layout="vertical"
            onFinish={(values) => {
              console.log(values);
            }}
            form={form}
            style={{
              padding: screens.xs ? "8px" : "24px",
            }}
          >
            <ProductForm form={form} />
          </Form>
        </Drawer>
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
            columns={[
              ...getColumns(screens),
              {
                title: "Action",
                dataIndex: "action",
                width: screens.xs ? 100 : "15%",
                ellipsis: true,
                render: (_: string, record: Products) => {
                  return (
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setSelectedProduct(record);
                          setDrawerOpen(true);
                        }}
                      />
                      <Button
                        type="link"
                        onClick={() => {
                          showDeleteModal(record);
                        }}
                        icon={<DeleteOutlined />}
                      />
                    </Space>
                  );
                },
              },
            ]}
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

        <Modal
          title="Delete Product"
          open={deleteModalOpen}
          onOk={() =>
            productToDelete?._id && handleDeleteProduct(productToDelete._id)
          }
          onCancel={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this product?</p>
          {productToDelete && (
            <p>
              <strong>Product:</strong> {productToDelete.name}{" "}
            </p>
          )}
        </Modal>
      </Space>
    </>
  );
};

export default ProductsPage;


