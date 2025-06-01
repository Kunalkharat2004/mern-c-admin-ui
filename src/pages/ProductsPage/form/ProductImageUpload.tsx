import { PlusOutlined } from '@ant-design/icons';
import { Form, Space, Typography } from 'antd';
import { Upload } from 'antd';
import  { useState } from 'react'
import { useNotification } from '../../../context/NotificationContext';


const ProductImageUpload = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
    const notify = useNotification();
    
      const uploadProps = {
        name: "image",
        multiple: false,
        className: "avatar-uploader",
        showUploadList: false,
        beforeUpload: (file: File) => {
          // Image size must be less than 500KB
          if (file.size > 500 * 1024) {
            notify.error("Image must be less than 500KB");
          }

          // Image type must be image/jpeg or image/png
          const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
          if (!validImageTypes.includes(file.type)) {
            notify.error("Image type must be jpeg, png or jpg");
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
            <img
              src={imageUrl}
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
}

export default ProductImageUpload