import {
  DeleteOutlined,
  EditOutlined,
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
  Result,
  Space,
  Table,
  Grid,
  Modal,
  Typography,
} from "antd";
import { NavLink } from "react-router-dom";
import {
  createPromo,
  deletePromo,
  getAllPromos,
  updatePromo,
} from "../../http/api";
import { useEffect, useMemo, useState } from "react";
import { FieldData, Promo } from "../../types";
import { useNotification } from "../../context/NotificationContext";
import { debounce } from "lodash";
import PromosFilter from "./PromosFilter";
import { format } from "date-fns";
import PromosForm from "./PromosForm";

const { useBreakpoint } = Grid;

const BreadcrumbItems = [
  {
    title: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    title: "Promos",
    link: "/promos",
  },
];

const getColumns = (screens: Record<string, boolean>) => [
  {
    title: "Title",
    dataIndex: "title",
    width: screens.xs ? 150 : "25%",
    ellipsis: true,
  },
  {
    title: "Code",
    dataIndex: "code",
    width: screens.xs ? 150 : "20%",
    ellipsis: true,
  },
  {
    title: "Discount (in %)",
    dataIndex: "discount",
    width: screens.xs ? 100 : "15%",
    ellipsis: true,
  },
  // {
  //   title: "Restaurant",
  //   dataIndex: "tenantId",
  //   width: screens.xs ? 150 : "25%",
  //   ellipsis: true,
  // },
  {
    title: "Valid Till",
    dataIndex: "validTill",
    width: screens.xs ? 150 : "25%",
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

interface QueryParams {
  page: number;
  limit: number;
  q?: string;
}
const PromosPage = () => {
  const screens = useBreakpoint();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<Promo | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<Promo | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 5,
  });

  const getPromos = async () => {
    const filteredValues = Object.fromEntries(
      Object.entries(queryParams).filter((item) => !!item[1])
    );
    const queryParamasString = new URLSearchParams(
      filteredValues as unknown as Record<string, string>
    ).toString();
    const { data } = await getAllPromos(queryParamasString);
    return data;
  };
  const notification = useNotification();

  const addPromo = async (promoData: Promo) => {
    await createPromo(promoData);
  };

  const promoUpdate = async (promoData: Promo) => {
    if (!editPromo?._id) throw new Error("Promo ID is required");
    return await updatePromo(promoData as Promo, editPromo._id);
  };

  const {
    data: promos,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["promos", queryParams],
    queryFn: getPromos,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate, isPending: createPromoMutationPending } = useMutation({
    mutationKey: ["createPromo"],
    mutationFn: addPromo,
    onSuccess: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.success("Promo created successfully");
      queryClient.invalidateQueries({ queryKey: ["promos"] });
    },

    onError: () => {
      setDrawerOpen(false);
      form.resetFields();
      notification.error("Something went wrong");
    },
  });

  const { mutate: updateMutate, isPending: updatePromoMutationPending } =
    useMutation({
      mutationKey: ["updatePromo"],
      mutationFn: promoUpdate,
      onSuccess: () => {
        setDrawerOpen(false);
        form.resetFields();
        notification.success("Promo updated successfully");
        queryClient.invalidateQueries({ queryKey: ["promos"] });
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
      const payload = {
        title: values.title,
        code: values.code,
        discount: values.discount,
        validTill: values.endDate.format("YYYY-MM-DD"), // rename endDate → validTill
        tenantId: values.tenantId,
      };

      console.log("Payload ready for API:", payload);
      const isEditMode = !!editPromo;

      if (isEditMode && editPromo?._id) {
        console.log("Updating promo...", values);
        updateMutate({ ...payload, _id: editPromo._id });
      } else {
        console.log("Creating promo...", values);
        mutate(payload);
      }
    } catch (error) {
      console.error("Form validation or submission error:", error);
    }
  };

  useEffect(() => {
    if (editPromo) {
      setDrawerOpen(true);
      console.log("editPromo", editPromo);
      form.setFieldsValue({ ...editPromo, tenantId: editPromo.tenantId });
    }
  }, [editPromo, form]);

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
    // q: "Monsoon",
    // discount: 10,
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

  const handleDeletePromo = async (id: string | undefined) => {
    if (!id) {
      notification.error("Invalid promo ID");
      return;
    }
    try {
      await deletePromo(id);
      notification.success("Promo deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["promos"] });
      setDeleteModalOpen(false);
      setPromoToDelete(null);
    } catch (error) {
      console.error("Error deleting promo:", error);
      notification.error("Something went wrong");
    }
  };

  const showDeleteModal = (promo: Promo) => {
    setPromoToDelete(promo);
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
          <PromosFilter>
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
              Add Promo
            </Button>
          </PromosFilter>
        </Form>

        <Drawer
          title={editPromo ? "Edit Promo" : "Create Promo"}
          width={screens.xs ? "100%" : 720}
          loading={createPromoMutationPending || updatePromoMutationPending}
          onClose={() => {
            console.log("Drawer Closed");
            setDrawerOpen(false);
            setEditPromo(null);
            form.resetFields();
          }}
          destroyOnClose={true}
          open={drawerOpen}
          extra={
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setEditPromo(null);
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
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
            <PromosForm form={form} />
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
                render: (_: string, record: Promo) => {
                  return (
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditPromo(record);
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
            dataSource={promos?.data}
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
              current: queryParams.page,
              pageSize: queryParams.limit,
              total: promos?.total,
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
          title="Delete Promo"
          open={deleteModalOpen}
          onOk={() =>
            promoToDelete?._id && handleDeletePromo(promoToDelete._id)
          }
          onCancel={() => {
            setDeleteModalOpen(false);
            setPromoToDelete(null);
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this promo?</p>
          {promoToDelete && (
            <p>
              <strong>Promo:</strong> {promoToDelete.code}
            </p>
          )}
        </Modal>
      </Space>
    </>
  );
};

export default PromosPage;
