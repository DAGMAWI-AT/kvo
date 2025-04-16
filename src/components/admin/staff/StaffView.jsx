import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Descriptions, Image, Spin, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const StaffView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/staff/staff/${id}`);
        setStaff(response.data);
      } catch (error) {
        message.error('Failed to fetch staff details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="medium" />
      </div>
    );
  }

  if (!staff) {
    return <div>Staff member not found</div>;
  }

  return (
    <div className="p-6">
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back to List
      </Button>

      <Card
        title="Staff Details"
        extra={
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/staffs/edit/${id}`)}
          >
            Edit
          </Button>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Registration ID">{staff.registrationId}</Descriptions.Item>
          <Descriptions.Item label="Name">{staff.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{staff.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{staff.phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Position">{staff.position || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={staff.role === 'sup_admin' ? 'gold' : 'blue'}>
              {staff.role.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={staff.status === 'active' ? 'green' : 'red'}>
              {staff.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Email Verified">
            {staff.email_verified ? 'Yes' : 'No'}
          </Descriptions.Item>
          <Descriptions.Item label="Photo">
            {staff.photo ? (
              <Image
                width={100}
                src={`${process.env.REACT_APP_API_URL}/staff/${staff.photo}`}
                alt="Staff Photo"
                className="rounded"
              />
            ) : 'No photo'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(staff.created_at).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {moment(staff.updated_at).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default StaffView;