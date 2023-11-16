import React from 'react';
import { Button } from '@chakra-ui/react';

const CustomButton = ({ label, onClick }) => {
  return (
    <Button
      colorScheme="teal"
      variant="outline"
      width={'full'}
      mx={2}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
