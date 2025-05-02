// // src/pages/BackupPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, Button, Space, Alert, Spin, Tag } from 'antd';
// import { DownloadOutlined, CloudSyncOutlined } from '@ant-design/icons';

// const Backup = () => {
//   const [backups, setBackups] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [creatingBackup, setCreatingBackup] = useState(false);

//   // Fetch backups on mount
//   useEffect(() => {
//     fetchBackups();
//   }, []);

//   const fetchBackups = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/backups/list`, {
//         withCredentials: true
//       });
  
//       const data = Array.isArray(response.data)
//         ? response.data
//         : Array.isArray(response.data.data)
//         ? response.data.data
//         : [];
  
//       setBackups(data);
//     } catch (err) {
//       setError('Failed to load backups');
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const createBackup = async () => {
//     setCreatingBackup(true);
//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/backups/create`, {}, {
//         withCredentials: true
//       });
//       await fetchBackups();
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Backup creation failed');
//     } finally {
//       setCreatingBackup(false);
//     }
//   };

//   const downloadBackup = (filename) => {
//     window.open(
//       `${process.env.REACT_APP_API_URL}/api/backups/download/${filename}`,
//       '_blank'
//     );
//   };

//   const columns = [
//     {
//       title: 'File Name',
//       dataIndex: 'filename',
//       key: 'filename',
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       key: 'type',
//       render: (type) => (
//         <Tag color={type === 'database' ? 'blue' : 'green'}>
//           {type.toUpperCase()}
//         </Tag>
//       )
//     },
//     {
//       title: 'Date',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (date) => new Date(date).toLocaleString()
//     },
//     {
//       title: 'Size',
//       dataIndex: 'size',
//       key: 'size',
//       render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Button
//           icon={<DownloadOutlined />}
//           onClick={() => downloadBackup(record.filename)}
//         >
//           Download
//         </Button>
//       )
//     }
//   ];

//   return (
//     <div className="backup-management">
//       <div style={{ marginBottom: 16 }}>
//         <Space>
//           <Button
//             type="primary"
//             icon={<CloudSyncOutlined />}
//             onClick={createBackup}
//             loading={creatingBackup}
//           >
//             Create New Backup
//           </Button>
          
//           <Button onClick={fetchBackups} loading={loading}>
//             Refresh List
//           </Button>
//         </Space>
//       </div>

//       {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

//       <Spin spinning={loading}>
//         <Table
//           columns={columns}
//           dataSource={backups}
//           rowKey="filename"
//           pagination={{ pageSize: 10 }}
//         />
//       </Spin>
//     </div>
//   );
// };

// export default Backup;