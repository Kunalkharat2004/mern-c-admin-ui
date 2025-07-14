import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Grid,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { useMemo, useState } from "react";

import { debounce } from "lodash";
import { getAllTenants, getTenantById } from "../../http/api";
import { useAuthStore } from "../../store";
import dayjs from "dayjs";
import { Tenant } from "../../types";

const { useBreakpoint } = Grid;

interface QueryParams {
  page: number;
  limit: number;
  q?: string;
}

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";

const PromoForm = ({ form }: { form: FormInstance }) => {
  const screens = useBreakpoint();
  const selectedTenantId = Form.useWatch("tenantId");

  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 5,
  });

  const getTenants = async () => {
    const params = { ...queryParams };
    if (!params.q) {
      delete params.q;
    }

    const queryString = new URLSearchParams(
      params as unknown as Record<string, string>
    ).toString();

    const { data } = await getAllTenants(queryString);

    return data;
  };

  const { data: tenant, isFetching: loadingTenantPage } = useQuery({
    queryKey: ["tenant", queryParams],
    queryFn: getTenants,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: singleTenant, isFetching: loadingTenantById } = useQuery({
    queryKey: ["tenantById", selectedTenantId],
    queryFn: () => getTenantById(selectedTenantId!),
    enabled: Boolean(selectedTenantId),
    staleTime: 1000 * 60 * 5,
  });

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        q: value || undefined,
        page: 1,
      }));
    }, 500);
  }, []);

  const handleSearch = (value: string) => {
    if (value.trim() !== "") {
      debounceQUpdate(value);
    } else {
      setQueryParams((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { q, ...rest } = prev;
        return {
          ...rest,
          page: 1,
        };
      });
    }
  };
  const { user } = useAuthStore();
  return (
    <>
      <Space
        direction="vertical"
        size={screens.xs ? "middle" : "large"}
        style={{ width: "100%" }}
      >
        <Card title="Promo Info">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Promo Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Promo title is required",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Code"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Promo code is required",
                  },
                  {
                    // Promo code must be alphanumeric and in uppercase with atleast 3 characters
                    pattern: /^[A-Z0-9]{3,}$/,
                    message:
                      "Promo code must be alphanumeric and at least 3 characters long",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>

            {/* {Promo Discount} */}
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Promo discount is required",
                  },
                ]}
              >
                <Input type="number" addonAfter="%" allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {user?.role === "admin" && (
          <Card title="Tenant Info">
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Select Tenant"
                  name="tenantId"
                  rules={[
                    {
                      required: true,
                      message: "Tenant is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Tenant"
                    onSearch={handleSearch}
                    loading={loadingTenantPage || loadingTenantById}
                    allowClear
                    filterOption={false} // server‐side filter only
                    notFoundContent={
                      tenant?.data?.length === 0 ? "No tenant found" : null
                    }
                  >
                    {/* 1) If we already have a selectedTenantId, but it isn’t in the current page,
                        inject that option so its name displays. */}
                    {singleTenant?.data &&
                      !tenant?.data.find(
                        (t: Tenant) => t.id === singleTenant.data.id
                      ) && (
                        <Select.Option
                          key={singleTenant.data.id}
                          value={singleTenant.data.id}
                        >
                          {singleTenant.data.name}
                        </Select.Option>
                      )}

                    {/* 2) Then render the paginated list of five (or whatever) tenants */}
                    {tenant?.data.map((t: Tenant) => (
                      <Select.Option key={t.id} value={t.id}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        <Card title="Validity Period">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Start Date (from 12 midnight)"
                name="startDate"
                initialValue={dayjs().startOf("day")}
                rules={[
                  {
                    required: true,
                    message: "Start date is required",
                  },
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  style={{ width: "100%" }}
                  placeholder="Select start date"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="End Date (till 12 midnight)"
                name="endDate"
                initialValue={dayjs(form.getFieldValue("validTill"))}
                rules={[
                  {
                    required: true,
                    message: "End date is required",
                  },
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  style={{ width: "100%" }}
                  placeholder="Select end date"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {/* <Card title="Other properties">
          <Row>
            <Col>
              <Space>
                <Form.Item name="isPublished" valuePropName="checked">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                  />
                </Form.Item>
                <Typography.Text
                  style={{
                    display: "block",
                    marginBottom: "24px",
                  }}
                >
                  Publish
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Card> */}
      </Space>
    </>
  );
};

export default PromoForm;
