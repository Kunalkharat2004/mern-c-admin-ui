import { PlusOutlined } from "@ant-design/icons";
import { Form, Image, Space, Typography } from "antd";
import { Upload } from "antd";
import { useState, useEffect } from "react";
import { useNotification } from "../../../context/NotificationContext";

const ToppingImageUpload = ({
  initialImage,
}: {
  initialImage: string | null;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const notify = useNotification();

  useEffect(() => {
    setImageUrl(initialImage);
  }, [initialImage]);

  const uploadProps = {
    name: "image",
    multiple: false,
    className: "avatar-uploader",
    showUploadList: false,
    beforeUpload: (file: File) => {
      // Image size must be less than 1.5MB
      if (file.size > 1.5 * 1024 * 1024) {
        notify.error("Image must be less than 1.5MB");
        return false;
      }

      // Image type must be image/jpeg or image/png
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        notify.error("Image type must be jpeg, png or jpg");
        return false;
      }

      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };

  return (
    <Form.Item
      name="image"
      rules={[
        {
          required: true,
          message: "Image is required",
        },
      ]}
    >
      <Upload {...uploadProps} listType="picture-card">
        {imageUrl ? (
          <Image
            src={imageUrl}
            fallback="https://via.placeholder.com/150"
            preview={false}
            alt="product"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Space direction="vertical" align="center">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ToppingImageUpload;
