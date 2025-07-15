import { Select, Space, Typography } from "antd";
import { OrderStatus } from "../../../types/order";
import { useState } from "react";
import { capitalizeText } from "../../../utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../../../http/api";

const OrderStatusSelector = ({
  orderId,
  orderValue = OrderStatus.RECEIVED,
}: {
  orderId: string;
  orderValue?: OrderStatus;
}) => {
  const STATUS_LIST = [
    OrderStatus.RECEIVED,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
  ];
  const [selected, setSelected] = useState<OrderStatus>(orderValue);

  const queryClient = useQueryClient();

  const { mutate,isPending } = useMutation({
    mutationKey: ["orderStatus", orderId],
    mutationFn: async (status: { status: OrderStatus }) => {
      const fields = {
        fields: "tenantId",
      };
      const queryParamasString = new URLSearchParams(fields).toString();
      return await updateOrderStatus(orderId, queryParamasString, status).then(
        (res) => res.data
      );
    },
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:["order", orderId]})
    }
  });

  const currentIndex = STATUS_LIST.indexOf(selected);
  const orderStatusOptions = STATUS_LIST.map((st, idx) => ({
    value: st,
    label: capitalizeText(st.replace(/_/g, " ")),
    disabled: idx < currentIndex,
  }));

  const handleChange = (value: OrderStatus) => {
    setSelected(value);
    mutate({ status: value });
  };
  return (
    <Space direction="vertical" size="small">
      <Typography.Text>Change Order Status</Typography.Text>
      <Select
        value={selected}
        style={{ width: 220 }}
        onChange={handleChange}
        options={orderStatusOptions}
        loading={isPending}
      />
    </Space>
  );
};

export default OrderStatusSelector;
