// src/components/shared/ModalWrapper.tsx
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
  } from '@/components/ui/dialog';
  
  interface ModalWrapperProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
  
  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };
  
  export function ModalWrapper({
    open, onClose, title, description, children, size = 'md',
  }: ModalWrapperProps) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className={sizeMap[size]}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  