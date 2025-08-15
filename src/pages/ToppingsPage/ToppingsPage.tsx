import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
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
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createToppingApi,
  deleteTopping,
  getAllToppings,
  updateToppingApi,
} from "../../http/api";
import { useEffect, useMemo, useState } from "react";
import {
  CreateToppingResponse,
  FieldData,
  Toppings,
} from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import { useNotification } from "../../context/NotificationContext";
import { makeFormData } from "./helper";
import ToppingsFilter from "./ToppingsFilter";
import ToppingForm from "./form/ToppingForm";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Toppings",
    link: "/toppings",
  },
];

const getColumns = (screens: Record<string, boolean>) => [
  {
    title: "Name",
    dataIndex: "name",
    width: screens.xs ? "40%" : "30%",
    ellipsis: true,
    render: (text: string, record: Toppings) => {
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
    title: "Price",
    dataIndex: "price",
    width: screens.xs ? "30%" : "20%",
    ellipsis: true,
    render: (text: string) => (
      <Typography.Text ellipsis style={{ maxWidth: screens.xs ? 100 : 200 }}>
         ₹ {text}
      </Typography.Text>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    width: screens.xs ? "15%" : "15%",
    ellipsis: true,
    render: (_: string, record: Toppings) => {
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
    render: (_: boolean, record: Toppings) => {
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
  {},
];

const ToppingsPage = () => {
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
  const [selectedTopping, setSelectedTopping] = useState<Toppings | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toppingToDelete, setToppingToDelete] = useState<Toppings | null>(null);

  const getToppings = async () => {
    const filteredValues = Object.fromEntries(
      Object.entries(queryParams).filter((item) => !!item[1])
    );
    const queryParamasString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getAllToppings(queryParamasString);
    return data;
  };

  const {
    data: toppings,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["toppings", queryParams],
    queryFn: getToppings,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (selectedTopping) {
      setDrawerOpen(true);
      console.log("selectedTopping", selectedTopping);


      form.setFieldsValue({
        ...selectedTopping,
        price: selectedTopping.price.toString(),
        categoryId: selectedTopping.category._id,
      });
    }
  }, [selectedTopping, form]);

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
    // q: "Jalapeno",
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

  const createTopping = async (
    toppingData: FormData
  ): Promise<CreateToppingResponse> => {
    if (selectedTopping) {
      // edit mode
      const { data } = await updateToppingApi(toppingData, selectedTopping._id!);
      return data;
    } else {
      const { data } = await createToppingApi(toppingData);
      console.log("data", data);
      return data;
    }
  };

  const queryClient = useQueryClient();
  const { mutate: toppingMutate, isPending: createToppingMutationPending } =
    useMutation({
      mutationKey: ["createTopping"],
      mutationFn: createTopping,
      onSuccess: () => {
        setDrawerOpen(false);
        form.resetFields();
        notify.success(
          selectedTopping
            ? "Topping updated successfully"
            : "Topping created successfully"
        );
        queryClient.invalidateQueries({ queryKey: ["toppings"] });
      },

      onError: () => {
        setDrawerOpen(false);
        form.resetFields();
        notify.error("Something went wrong");
      },
    });

  const handleOnSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      console.log("values", values);
      const categoryId = values.categoryId;

      const toppingData = {
        ...values,
        image: values.image,
        categoryId: categoryId,
        tenantId: user?.role === "manager" ? user.tenant?.id : values.tenantId,
        price: parseFloat(values.price),
        isPublished: values.isPublished ? true : false,
      };
      console.log("toppingData", toppingData);
      const formData = makeFormData(toppingData);
      toppingMutate(formData);
    } catch (err) {
      console.error("Form validation or submission error:", err);
      notify.error("Something went wrong");
    }
  };

  const handleDeleteTopping = async (id: string | undefined) => {
    if (!id) {
      notify.error("Invalid toppingData ID");
      return;
    }
    try {
      await deleteTopping(id);
      notify.success("Topping deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["toppings"] });
      setDeleteModalOpen(false);
      setToppingToDelete(null);
    } catch (error) {
      console.error("Error deleting topping:", error);
      notify.error("Something went wrong");
    }
  };

  const showDeleteModal = (topping: Toppings) => {
    setToppingToDelete(topping);
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
          <ToppingsFilter>
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
              Add Topping
            </Button>
          </ToppingsFilter>
        </Form>

        <Drawer
          title={selectedTopping ? "Update Topping" : "Create Topping"}
          maskClosable={true}
          width={screens.xs ? "100%" : 720}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
            setSelectedTopping(null);
            form.resetFields();
          }}
          destroyOnClose={true}
          open={drawerOpen}
          extra={
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  setSelectedTopping(null);
                  notify.info(
                    selectedTopping
                      ? "Topping update cancelled"
                      : "Topping creation cancelled"
                  );
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOnSubmit}
                loading={createToppingMutationPending}
                type="primary"
              >
                {selectedTopping ? "Update" : "Submit"}
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
            <ToppingForm form={form} />
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
                render: (_: string, record: Toppings) => {
                  return (
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setSelectedTopping(record);
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
            dataSource={toppings?.data}
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
              total: toppings?.total,
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
          title="Delete Topping"
          open={deleteModalOpen}
          onOk={() =>
            toppingToDelete?._id && handleDeleteTopping(toppingToDelete._id)
          }
          onCancel={() => {
            setDeleteModalOpen(false);
            setToppingToDelete(null);
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this topping?</p>
          {toppingToDelete && (
            <p>
              <strong>Topping:</strong> {toppingToDelete.name}{" "}
            </p>
          )}
        </Modal>
      </Space>
    </>
  );
};

export default ToppingsPage;
