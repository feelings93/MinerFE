import { Breadcrumb, Button, Modal, Space, Table, Tag, theme } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import DefaultMineModal from '../../components/mine/DefaultMineModal';
import SendModal from '../../components/mine/SendModal';
import TemplateModal from '../../components/mine/TemplateModal';
import TransactionDetailModal from '../../components/mine/TransactionDetailModal';
import WalletModal from '../../components/mine/WalletModal';

const Mine = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [showDefaultMineModal, setShowDefaultMineModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const viewTransaction = (transaction) => {
    setViewingTransaction(transaction);
  };

  const handleClose = () => {
    setViewingTransaction(null);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const {
    isLoading,
    data: blockTemplate,
    error,
  } = useQuery('blockTemplate', () =>
    axios
      .get('http://localhost:4500/bitcoin/blockTemplate')
      .then((res) => res.data)
  );
  const { isLoading: isMining, mutate: mine } = useMutation(
    (info) =>
      axios.post(`http://localhost:4500/bitcoin/mine`, info, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: () => {
        toast.success('Mine successfully');
      },
      onError: (error) => {
        if (Array.isArray(error.response.data.error)) {
          error.data.error.forEach((el) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error(error.response.data.message, {
            position: 'top-right',
          });
        }
      },
    }
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows([...selectedRows]);
    },
  };

  const columns = [
    {
      title: 'Tx ID',
      dataIndex: 'txid',
      key: 'txid',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <a onClick={() => viewTransaction(record)}>View</a>
        </Space>
      ),
    },
  ];

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Mine</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Space style={{ justifyContent: 'flex-end' }}>
          <Button
            style={{ marginLeft: 'auto' }}
            onClick={() => {
              setShowWalletModal(true);
            }}
          >
            {`See wallet`}
          </Button>
          <Button
            style={{ marginLeft: 'auto' }}
            onClick={() => {
              setShowTemplateModal(true);
            }}
          >
            {`See block template`}
          </Button>
        </Space>
        <Space style={{ justifyContent: 'flex-end' }}>
          <Button
            style={{ marginLeft: 'auto' }}
            type='primary'
            onClick={() => {
              const body = {
                address: 'bcrt1qlf4lhzwjhudc39ww74yjjr3l7wthqey4t0acka',
                txIDs: selectedRows.map((row) => row.txid),
              };
              mine(body);
            }}
          >
            {`Mine manual with selected transactions (${selectedRows.length})`}
          </Button>
          <Button
            style={{ marginLeft: 'auto' }}
            type='primary'
            onClick={() => {
              const body = {
                address: 'bcrt1qlf4lhzwjhudc39ww74yjjr3l7wthqey4t0acka',
                autoPick: true,
              };
              mine(body);
            }}
          >
            {`Mine manual with auto pick transactions`}
          </Button>
          <Button
            style={{ marginLeft: 'auto' }}
            type='primary'
            onClick={() => {
              setShowDefaultMineModal(true);
            }}
          >
            {`Mine with provided method`}
          </Button>
          <Button
            style={{ marginLeft: 'auto' }}
            type='primary'
            onClick={() => {
              setShowSendModal(true);
            }}
          >
            {`Send to address`}
          </Button>
        </Space>

        {/* {JSON.stringify(blockTemplate)} */}
        <Table
          rowKey='txid'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={blockTemplate.transactions.map((transaction) => ({
            ...transaction,
          }))}
        />
        {viewingTransaction && (
          <TransactionDetailModal
            transaction={viewingTransaction}
            onClose={handleClose}
          />
        )}
        {showDefaultMineModal && (
          <DefaultMineModal onClose={() => setShowDefaultMineModal(false)} />
        )}
        {showSendModal && <SendModal onClose={() => setShowSendModal(false)} />}
        {showWalletModal && (
          <WalletModal onClose={() => setShowWalletModal(false)} />
        )}
        {showTemplateModal && (
          <TemplateModal onClose={() => setShowTemplateModal(false)} />
        )}
      </div>
    </>
  );
};

//  const createPostFn = async (formData) => {
//   const response = await ;
//   return response.data;
// };

export default Mine;
// second add: bcrt1qzxdaszhnv622vesfj6p0mlhqaal8fhevfswrtw
// third add: bcrt1qmgc5z7yte505f7vz58c8fhwx4tn36pqs2ghrxp
