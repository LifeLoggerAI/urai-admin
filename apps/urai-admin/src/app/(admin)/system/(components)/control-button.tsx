
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ControlButtonProps {
  label: string;
  action: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({ label, action }) => {
  return (
    <Button onClick={action} className="w-full">
      {label}
    </Button>
  );
};

export default ControlButton;
