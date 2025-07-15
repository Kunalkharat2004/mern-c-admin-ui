import { Select, Space, Typography } from "antd"
import { OrderStatus } from "../../../types/order"
import { useState } from "react";
import { capitalizeText } from "../../../utils";

const OrderStatusSelector = ({orderValue = OrderStatus.RECEIVED}:{orderValue?:OrderStatus}) => {

    const STATUS_LIST = [
  OrderStatus.RECEIVED,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];
  const [selected, setSelected] = useState<OrderStatus>(orderValue);

  const currentIndex = STATUS_LIST.indexOf(selected);
  const orderStatusOptions = STATUS_LIST.map((st,idx)=>({
    value: st,
    label: capitalizeText(st.replace(/_/g, ' ')),
    disabled: idx < currentIndex
  }))

  const handleChange = (value: OrderStatus) =>{
    setSelected(value)
  }
  return (
    <Space direction="vertical" size="small">
                 <Typography.Text>Change Order Status</Typography.Text>
                   <Select
              defaultValue={OrderStatus.RECEIVED}
              style={{ width: 220 }}
              onChange={handleChange}
              options={orderStatusOptions}
            />
              </Space>
  )
}

export default OrderStatusSelector