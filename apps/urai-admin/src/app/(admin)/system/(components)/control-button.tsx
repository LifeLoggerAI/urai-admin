'use client';

import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

type ControlButtonProps = {
  label: string;
  action: () => Promise<any>;
};

export function ControlButton({ label, action }: ControlButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await action();
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Executing...' : label}
    </Button>
  );
}
