import { EditOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
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
  Result,
  Space,
  Table,
  Grid,
} from "antd";
import { NavLink } from "react-router-dom";
import { createUser, getAllUsers, updateUser } from "../../http/api";
import UsersFilter from "./UsersFilter";
import { useEffect, useMemo, useState } from "react";
import UserForm from "./UserForm";
import { FieldData, User } from "../../types";
import { useNotification } from "../../context/NotificationContext";
import { debounce } from "lodash";
import { GoDash } from "react-icons/go";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Users",
    link: "/users",
  },
];

const getColumns = (screens: Record<string, boolean>) => [
  {
    title: "Name",
    dataIndex: "firstName",
    width: screens.xs ? 150 : "25%",
    ellipsis: true,
    render: (text: string, record: { firstName: string; lastName: string }) => {
      return `${record.firstName} ${record.lastName}`
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
  },
  {
    title: "Role",
    dataIndex: "role",
    width: screens.xs ? 100 : "15%",
    ellipsis: true,
  },
  {
    title: "Restaurant",
    dataIndex: "tenant",
    width: screens.xs ? 150 : "25%",
    ellipsis: true,
    render: (_text: string, record: User) => {
      // show null if tenant is null
      if (!record.tenant) return <GoDash />;
      return record.tenant.name;
    },
  },

  {
    title: "Address",
    dataIndex: "address",
    width: screens.xs ? 150 : "30%",
    ellipsis: true,
  },
];

const UsersPage = () => {
  const screens = useBreakpoint();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: 5,
  });

  const getUsers = async () => {
    const filteredValues = Object.fromEntries(
      Object.entries(queryParams).filter((item) => !!item[1])
    );
    const queryParamasString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getAllUsers(queryParamasString);
    return data;
  };
  const notification = useNotification();

  const addUser = async (userData: User) => {
    await createUser(userData);
  };

  const userUpdate = async (userData: User & { confirmPassword?: string }) => {
    if (!editUser?.id) throw new Error("User ID is required");

    // Remove confirmPassword if it exists as it's not needed for update
    // const { confirmPassword, ...updateData } = userData;

    console.log("Sending update request for user:", editUser.id, userData);
    return await updateUser(userData as User, editUser.id);
  };

  const {
    data: users,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: getUsers,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate, isPending: createUserMutationPending } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: addUser,
    onSuccess: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.error("Something went wrong");
    },
  });

  const { mutate: updateMutate, isPending: updateUserMutationPending } =
    useMutation({
      mutationKey: ["updateUser"],
      mutationFn: userUpdate,
      onSuccess: () => {
        setDrawerOpen(false);
        form.resetFields();
        notification.success("User updated successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },

      onError: () => {
        setDrawerOpen(false);
        form.resetFields();
        notification.error("Something went wrong");
      },
    });

  const [form] = Form.useForm();
  const [formfilter] = Form.useForm();

  const handleOnSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const isEditMode = !!editUser;

      if (isEditMode && editUser?.id) {
        console.log("Updating user...", values);
        await updateMutate({ ...values, id: editUser.id });
      } else {
        console.log("Creating user...", values);
        await mutate(values);
      }
    } catch (error) {
      console.error("Form validation or submission error:", error);
    }
  };

  useEffect(() => {
    if (editUser) {
      setDrawerOpen(true);
      console.log("editUser", editUser);
      form.setFieldsValue({ ...editUser, tenantId: editUser.tenant?.id });
    }
  }, [editUser, form]);

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        q: value,
        currentPage: 1,
      }));
    }, 500);
  }, []);

  const handleFilterChange = (changedFields: FieldData[]) => {
    // {
    // q: "K",
    // role: "admin"
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
        currentPage: 1,
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
          <UsersFilter
            onFilterChange={(FilterName, FilterValue) =>
              console.log(FilterName, FilterValue)
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                console.log("Add User Clicked");
                setDrawerOpen(true);
              }}
              style={{
                width: screens.xs ? "100%" : "auto",
                marginTop: screens.xs ? "8px" : "0",
              }}
            >
              Add User
            </Button>
          </UsersFilter>
        </Form>

        <Drawer
          title={editUser ? "Edit User" : "Create a new user"}
          width={screens.xs ? "100%" : 720}
          loading={createUserMutationPending || updateUserMutationPending}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
            setEditUser(null);
            form.resetFields();
          }}
          destroyOnClose={true}
          open={drawerOpen}
          extra={
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleOnSubmit} type="primary">
                Submit
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
            <UserForm
              isEditMode={!!editUser}
              initialValues={editUser || undefined}
            />
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
                render: (_: string, record: User) => {
                  return (
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditUser(record);
                        }}
                      />
                      {/* <Button type="link" icon={<DeleteOutlined />} /> */}
                    </Space>
                  );
                },
              },
            ]}
            dataSource={users?.data}
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
              total: users?.total,
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
  );
};

export default UsersPage;
