import { Input, Modal, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

const DefaultMineModal = (props) => {
  const { onClose } = props;
  const [address, setAddress] = useState('');
  const [blockQty, setBlockQty] = useState('');
  const { isLoading, mutate: mine } = useMutation(
    (info) =>
      axios.post(`http://localhost:4500/bitcoin/generateToAddress`, info, {
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
          toast.error(error.response.data.message?.message, {
            position: 'top-right',
          });
        }
      },
    }
  );

  return (
    <Modal
      title='Generate to address'
      open={true}
      onOk={() => {
        mine({ address, qty: Number(blockQty) });
        onClose();
      }}
      onCancel={onClose}
      okButtonProps={{
        disabled:
          !address ||
          !blockQty ||
          isNaN(Number(blockQty)) ||
          Number(blockQty) <= 0,
      }}
    >
      <Input
        onChange={(e) => setAddress(e.target.value)}
        placeholder='Address'
        style={{ marginBottom: '8px' }}
      />
      <Input
        onChange={(e) => setBlockQty(e.target.value)}
        placeholder='Block qty'
      />
    </Modal>
  );
};

export default DefaultMineModal;
