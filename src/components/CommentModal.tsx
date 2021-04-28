import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Textarea,
  ModalBody,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useState } from "react";
import getApiUrl from "../utils/getApiUrl";
import { TaskComment, TaskData, User } from "../types/app";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskData;
  updateTask: (task: TaskData) => Promise<void>;
  user: User;
}

const createComment = async (comment: TaskComment) => {
  const url = getApiUrl("CreateComment");
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });
};

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  task,
  updateTask,
  user,
}: CommentModalProps) => {
  const [commentText, setComment] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (commentText === "") {
      setError(true);
      return;
    }
    const comment = {
      text: commentText,
      authorId: user.id,
      taskId: task.taskId,
    };
    createComment(comment);
    updateTask(task);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Комментарий</ModalHeader>
          <ModalBody>
            <Textarea
              placeholder="Оставьте комментарий"
              required
              value={commentText}
              onChange={({ target: { value } }) => {
                setError(false);
                setComment(value);
              }}
            ></Textarea>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Отменить
            </Button>
            <Button colorScheme="blue" onClick={() => handleSubmit()}>
              Сохранить и отправить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentModal;
