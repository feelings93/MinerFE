import { Modal, Spin } from 'antd';
import axios from 'axios';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import { useQuery } from 'react-query';

const WalletModal = (props) => {
  const { onClose } = props;
  const {
    isLoading,
    data: walletInfo,
    error,
  } = useQuery('walletInfo', () =>
    axios
      .get('http://localhost:4500/bitcoin/walletInfo')
      .then((res) => res.data)
  );
  if (error) {
    onClose();
  }
  return (
    <Modal
      title='Wallet info'
      open={true}
      onOk={onClose}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      {isLoading ? <Spin /> : <JSONTree data={walletInfo} />}
    </Modal>
  );
};

export default WalletModal;
