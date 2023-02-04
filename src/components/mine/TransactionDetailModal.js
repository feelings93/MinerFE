import { Modal, Spin } from 'antd';
import axios from 'axios';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import { useQuery } from 'react-query';

const TransactionDetailModal = (props) => {
  const { transaction, onClose } = props;
  const {
    isLoading,
    data: decodedTransaction,
    error,
  } = useQuery('decodeTransaction', () =>
    axios
      .post('http://localhost:4500/bitcoin/decodeTransaction', { transaction })
      .then((res) => res.data)
  );
  if (error) {
    onClose();
  }
  return (
    <Modal
      title='Transaction Detail'
      open={transaction}
      onOk={onClose}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      {isLoading ? <Spin /> : <JSONTree data={decodedTransaction} />}
    </Modal>
  );
};

export default TransactionDetailModal;
