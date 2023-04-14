import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';

type Props = {
  children?: React.ReactNode;
  onConfirm: () => void;
  isOpen: boolean;
  handleClose: (open: boolean) => void;
}
export default function ConfirmationDialog({children, onConfirm, isOpen = false, handleClose}: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>

      {children && (
        <Dialog.Trigger asChild>
          {children}
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Are you Sure?</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            You are going to delete All Nodes.
          </Dialog.Description>
          
          <div className='flex mt-6 justify-end'>
            <Dialog.Close asChild onClick={onConfirm}>
              <button className="Button green">Confirm</button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <X size={32} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
