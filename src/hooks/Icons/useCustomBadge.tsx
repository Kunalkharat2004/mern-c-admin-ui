import { Tag } from "antd";

interface CustomBadgeProps {
  label: string;
backgroundColor?: string;
    textColor?: string;
    boderColor?: string;

}

const CustomBadge = ({ 
    label = "Preparing",
    backgroundColor = "#fff1f0",
    textColor = "#f5222d",
    boderColor,
}: CustomBadgeProps) => {

 switch(label){
    case "Preparing":
      backgroundColor = "#fff1f0";
      textColor = "#f5222d";
      break;
    case "Delivered":
      backgroundColor = "#e6fffb";
      textColor = "#52c41a";
      break;
    case "Cancelled":
      backgroundColor = "#fff7e6";
      textColor = "#faad14";
      break;
    case "On the way":
      backgroundColor = "#e6f7ff";
      textColor = "#1890ff";
      break;
 }
  return (
    <Tag
      style={{
        backgroundColor,  
        color: textColor,         
        border: `1px solid ${boderColor ?? textColor}`,
        borderRadius: "9999px",     // pill shape
        padding: "0 16px",          // horizontal padding
        width: "90px",              // auto width
        textAlign: "center",        // center text
      }}
    >
      {label}
    </Tag>
  );
};

export default CustomBadge;
