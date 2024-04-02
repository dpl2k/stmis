import React from 'react';
import Button from '@mui/material/Button';

const ButtonComponent = ({ variant, color, onClick, children }) => {
    return (
        <Button variant={variant} color={color} onClick={onClick}>
            {children}
        </Button>
    );
};

export default ButtonComponent;