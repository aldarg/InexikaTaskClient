import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { useRef } from "react";

interface ConfirmDialogParams {
  isOpen: boolean;
  onClose: () => void;
  action: () => void;
  text: {
    header: string;
    body: string;
  };
}

const ConfirmDialog: React.FC<ConfirmDialogParams> = ({
  isOpen,
  onClose,
  action,
  text,
}: ConfirmDialogParams) => {
  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>{text.header}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{text.body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Отменить
            </Button>
            <Button colorScheme="red" ml={3} onClick={action}>
              Да
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConfirmDialog;
