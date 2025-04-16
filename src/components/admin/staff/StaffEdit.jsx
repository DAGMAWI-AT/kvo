import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Upload, 
  Switch, 
  Card, 
  Spin, 
  message, 
  Space,
  Typography,
  Row,
  Col,
  Avatar
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UploadOutlined, 
  UserOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { FaSave } from 'react-icons/fa';

const { Option } = Select;
const { Text } = Typography;

const StaffEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/staff/staff/${id}`);
        const staff = response.data;
        form.setFieldsValue({
          ...staff,
          email_verified: staff.email_verified || false
        });
        if (staff.photo) {
          setFileList([{
            uid: '-1',
            name: 'current-photo',
            status: 'done',
            url: `${process.env.REACT_APP_API_URL}/staff/${staff.photo}`
          }]);
        }
      } catch (error) {
        message.error('Failed to fetch staff details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id, form]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return isImage && isLt5M;
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    setSaving(true);
    const formData = new FormData();
    
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('photo', fileList[0].originFileObj);
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/staff/update/${id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      message.success('Staff updated successfully');
      navigate('/admin/staffs');
    } catch (error) {
      message.error(error.message);
    //   console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back to List
      </Button>

      <Card 
        title="Edit Staff Member" 
        className="shadow-sm rounded-lg"
        headStyle={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[32, 16]}>
            <Col xs={24} lg={16}>
              <div className="space-y-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Registration ID"
                      name="registrationId"
                      rules={[{ required: true }]}
                      labelCol={{ className: 'font-medium' }}
                    >
                      <Input 
                        disabled 
                        className="w-full" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[{ required: true }]}
                      labelCol={{ className: 'font-medium' }}
                    >
                      <Input 
                        className="w-full" 
                        size="large"
                        placeholder="Full name"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true, type: 'email' }]}
                      labelCol={{ className: 'font-medium' }}
                    >
                      <Input 
                        disabled 
                        className="w-full" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      labelCol={{ className: 'font-medium' }}
                    >
                      <Input 
                        className="w-full" 
                        size="large"
                        placeholder="Phone number"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Position"
                  name="position"
                  labelCol={{ className: 'font-medium' }}
                >
                  <Input 
                    className="w-full" 
                    size="large"
                    placeholder="Job position"
                  />
                </Form.Item>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Role"
                      name="role"
                      rules={[{ required: true }]}
                      labelCol={{ className: 'font-medium' }}
                    >
                      <Select 
                        className="w-full" 
                        size="large"
                      >
                        <Option value="admin">Admin</Option>
                        <Option value="sup_admin">Super Admin</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[{ required: true }]}
                      labelCol={{ className: 'font-medium' }}
                    >
                      <Select 
                        className="w-full" 
                        size="large"
                      >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Email Verified"
                  name="email_verified"
                  valuePropName="checked"
                  labelCol={{ className: 'font-medium' }}
                >
                  <Switch disabled />
                </Form.Item>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div className="border rounded-lg p-4 bg-gray-50">
                <Form.Item label="Profile Photo" className="mb-4">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={handleUploadChange}
                    maxCount={1}
                    accept="image/*"
                    className="avatar-uploader"
                  >
                    {fileList.length >= 1 ? null : (
                      <div className="flex flex-col items-center">
                        {fileList[0]?.url ? (
                          <Avatar 
                            size={120} 
                            src={fileList[0].url} 
                            icon={<UserOutlined />}
                            className="mb-2"
                          />
                        ) : (
                          <>
                            <UploadOutlined className="text-2xl mb-2" />
                            <Text>Upload Photo</Text>
                          </>
                        )}
                      </div>
                    )}
                  </Upload>
                  <Text type="secondary" className="block text-center">
                    JPEG/PNG, Max 5MB
                    <br />
                    Recommended: 500×500px
                  </Text>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div className="border-t pt-6 mt-8 flex justify-end space-x-4">
            <Button 
              onClick={() => navigate(-1)}
              size="large"
              className="min-w-32"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={saving}
              disabled={saving}
              size="large"
              className="min-w-32"
            >
           <FaSave/>   {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default StaffEdit;