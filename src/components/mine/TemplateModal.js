import { Modal, Spin } from 'antd';
import axios from 'axios';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import { useQuery } from 'react-query';

const TemplateModal = (props) => {
  const { onClose } = props;
  const {
    isLoading,
    data: blockTemplate,
    error,
  } = useQuery('blockTemplate', () =>
    axios
      .get('http://localhost:4500/bitcoin/blockTemplate')
      .then((res) => res.data)
  );
  if (error) {
    onClose();
  }
  return (
    <Modal
      title='Block template'
      open={true}
      onOk={onClose}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      {isLoading ? <Spin /> : <JSONTree data={blockTemplate} />}
    </Modal>
  );
};

export default TemplateModal;
