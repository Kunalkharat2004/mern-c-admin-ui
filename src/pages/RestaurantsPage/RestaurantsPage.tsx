import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Modal,
  Result,
  Space,
  Table,
  Grid,
  Checkbox,
  Typography,
} from "antd";
import { NavLink } from "react-router-dom";
import {
  createRestaurant,
  deleteRestaurantApi,
  getAllTenants,
  getManagerCount,
  updateTenant,
} from "../../http/api";
import { useEffect, useMemo, useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import RestaurantsFilter from "./RestaurantsFilter";
import { useForm } from "antd/es/form/Form";
import RestaurantForm from "./RestaurantForm";
import { FieldData, Restaurant } from "../../types";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import { format } from "date-fns";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Restaurants",
    link: "/restaurants",
  },
];

const getColumns = (screens: Record<string, boolean>) => [
  {
    title: "Name",
    dataIndex: "name",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
    render: (text: string) => {
      return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    width: screens.xs ? 200 : "40%",
    ellipsis: true,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:MM")}
        </Typography.Text>
      );
    },
  },
];

const RestaurantsPage = () => {
  const screens = useBreakpoint();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 5,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteRestaurant, setDeleteRestaurant] = useState<Restaurant | null>(
    null
  );
  const notification = useNotification();
  const [form] = useForm();
  const [formFilter] = Form.useForm();
  const { user } = useAuthStore();
  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
  const [managerCount, setManagerCount] = useState<number>(0);
  const [deleteManagers, setDeleteManagers] = useState<boolean>(true);

  const addRestaurant = async (restaurantData: Restaurant) => {
    await createRestaurant(restaurantData);
  };

  const { mutate, isPending: createRestaurantMutationPending } = useMutation({
    mutationKey: ["createRestaurant"],
    mutationFn: addRestaurant,
    onSuccess: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.success("Restaurant created successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },

    onError: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.error("Something went wrong");
    },
  });

  const updateRestaurant = async (restaurantData: Restaurant) => {
    return await updateTenant(restaurantData as Restaurant);
  };

  const {
    mutate: updateRestaurantMutate,
    isPending: updateRestaurantMutationPending,
  } = useMutation({
    mutationKey: ["updateRestaurant"],
    mutationFn: updateRestaurant,
    onSuccess: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.success("Restaurant updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },

    onError: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.error("Something went wrong");
    },
  });

  const handleOnSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const isEdit = !!editRestaurant;

      if (isEdit) {
        console.log("updating...");
        updateRestaurantMutate({ ...values, id: editRestaurant?.id });
      } else {
        console.log("creating...");
        mutate(values);
      }
    } catch (err) {
      console.error("Form validation or submission error:", err);
      notification.error("Something went wrong");
    }
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    setDrawerOpen(false);
    notification.success("Restaurant creation cancelled");
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getTenants = async () => {
    const filteredValues = Object.fromEntries(
      Object.entries(queryParams).filter((item) => !!item[1])
    );
    const queryParamsString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getAllTenants(queryParamsString);
    return data;
  };

  const {
    data: tenants,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: getTenants,
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
    const filter = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

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

  useEffect(() => {
    if (editRestaurant) {
      setDrawerOpen(true);
      form.setFieldsValue(editRestaurant);
    }
  }, [editRestaurant, form]);

  const showDeleteModal = async (restaurant: Restaurant) => {
    setDeleteRestaurant(restaurant);
    setIsDeleteModalOpen(true);
    try {
      const { data } = await getManagerCount(restaurant.id as string);
      console.log("count", data.count);
      setManagerCount(data.count);
      setDeleteManagers(true); // Set to true by default
    } catch (error) {
      console.error("Error fetching manager count:", error);
      notification.error("Failed to fetch manager count");
    }
  };

  const handleDeleteRestaurant = async (id: string | undefined) => {
    if (!id) {
      notification.error("Invalid restaurant ID");
      return;
    }

    try {
      await deleteRestaurantApi(`${id}?deleteManagers=${deleteManagers}`);
      notification.success("Restaurant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setIsDeleteModalOpen(false);
      setDeleteRestaurant(null);
      setManagerCount(0);
      setDeleteManagers(true);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      notification.error("Something went wrong");
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
        <Form form={formFilter} onFieldsChange={handleFilterChange}>
          <RestaurantsFilter
            onFilterChange={(FilterName, FilterValue) =>
              console.log(FilterName, FilterValue)
            }
          >
            {user?.role === "admin" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setDrawerOpen(true);
                  setEditRestaurant(null);
                }}
              >
                Add Restaurant
              </Button>
            )}
          </RestaurantsFilter>
        </Form>

        <Drawer
          title={editRestaurant ? "Edit Restaurant" : "Create a new restaurant"}
          width={screens.xs ? "100%" : 720}
          loading={
            createRestaurantMutationPending || updateRestaurantMutationPending
          }
          onClose={() => {
            setDrawerOpen(false);
            form.resetFields();
          }}
          destroyOnClose={true}
          open={drawerOpen}
          placement={screens.xs ? "bottom" : "right"}
          height={screens.xs ? "80%" : undefined}
          extra={
            <Space>
              <Button onClick={() => setIsModalOpen(true)}>Cancel</Button>
              <Modal
                title={
                  <span>
                    <ExclamationCircleOutlined
                      style={{ marginRight: 8, color: "#faad14" }}
                    />
                    Are you sure you want to cancel?
                  </span>
                }
                destroyOnClose={true}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Yes"
                cancelText="No"
              />
              <Button onClick={handleOnSubmit} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form
            layout="vertical"
            style={{
              width: "100%",
              padding: screens.xs ? "8px" : "24px",
            }}
            onFinish={(values) => {
              console.log(values);
            }}
            form={form}
          >
            <RestaurantForm />
          </Form>
        </Drawer>

        <div
          className="table-container"
          style={{ width: "100%", overflowX: "auto", maxWidth: "100vw" }}
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
                render: (_: string, record: Restaurant) => {
                  return (
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditRestaurant(record);
                        }}
                      />
                      <Button
                        type="link"
                        onClick={() => showDeleteModal(record)}
                        icon={<DeleteOutlined />}
                      />
                    </Space>
                  );
                },
              },
            ]}
            dataSource={tenants?.data}
            loading={isPending}
            size={screens.xs ? "small" : ("middle" as const)}
            scroll={{
              x: screens.xs ? 500 : "100%",
              scrollToFirstRowOnChange: true,
            }}
            style={{
              minWidth: screens.xs ? 500 : "auto",
              whiteSpace: "nowrap",
            }}
            pagination={{
              current: queryParams.page,
              pageSize: queryParams.limit,
              total: tenants?.total,
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
          />
        </div>

        <Modal
          title={
            <span>
              <ExclamationCircleOutlined
                style={{ color: "#ff4d4f", marginRight: 8 }}
              />
              Delete Restaurant
            </span>
          }
          open={isDeleteModalOpen}
          onOk={() =>
            deleteRestaurant?.id && handleDeleteRestaurant(deleteRestaurant.id)
          }
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setDeleteRestaurant(null);
            setManagerCount(0);
            setDeleteManagers(true);
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          {deleteRestaurant && (
            <>
              <p>Are you sure you want to delete this restaurant?</p>
              <p>
                <strong>Restaurant:</strong> {deleteRestaurant.name}
              </p>

              {managerCount > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ color: "#ff4d4f" }}>
                    This restaurant has {managerCount} manager
                    {managerCount !== 1 ? "s" : ""} associated with it.
                  </p>
                  <Checkbox
                    checked={deleteManagers}
                    onChange={(e) => setDeleteManagers(e.target.checked)}
                    style={{ marginTop: 8 }}
                  >
                    Delete all associated managers ({managerCount})
                  </Checkbox>
                </div>
              )}
            </>
          )}
        </Modal>
      </Space>
    </>
  );
};

export default RestaurantsPage;
