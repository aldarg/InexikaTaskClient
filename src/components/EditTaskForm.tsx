import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, IconButton, Wrap } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AppState, TaskData, User } from "../types/app";
import getApiUrl from "../utils/getApiUrl";
import Comments from "./Comments";
import CommentModal from "./CommentModal";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import ConfirmDialog from "./ConfirmDialog";

interface TaskFormProps {
  editedTaskId: string;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  user: User;
}

const btnName = {
  Clarified: "Согласовать",
  Declined: "Отклонить",
  Accepted: "На исполнение",
  Completed: "Выполнить",
};

const getTask = async (
  id: string,
  userId: string,
  callback: React.Dispatch<React.SetStateAction<TaskData>>
) => {
  const method = `GetTask/${id}`;
  const query = `?userid=${userId}`;
  const url = getApiUrl(method, query);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const result = await response.json();
    callback(result);
  }
};

const updateTask = async (
  task: TaskData,
  callback: React.Dispatch<React.SetStateAction<AppState>>
) => {
  const method = "UpdateWorktask";
  const url = getApiUrl(method);

  const result = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (result.ok) {
    callback((state) => ({
      ...state,
      isEditing: false,
      needRefresh: true,
    }));
  }
};

const deleteTask = async (
  taskId: string,
  callback: React.Dispatch<React.SetStateAction<AppState>>
) => {
  const method = `DeleteWorktask/${taskId}`;
  const url = getApiUrl(method);
  console.log("test");

  const result = await fetch(url, {
    method: "DELETE",
  });

  if (result.ok) {
    callback((state) => ({
      ...state,
      isEditing: false,
      needRefresh: true,
    }));
  }
};

const EditTaskForm: React.FC<TaskFormProps> = ({
  editedTaskId,
  setAppState,
  user,
}: TaskFormProps) => {
  const [task, setTask] = useState({} as TaskData);
  useEffect(() => {
    getTask(editedTaskId, user.id, setTask);
  }, [editedTaskId, user.id]);

  const {
    taskId,
    statusName,
    subject,
    text,
    canBeEdited,
    canBeDeleted,
    canTransitToStatuses,
    comments,
  } = task;

  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isChangeConfirmationOpen, setChangeConfirmationOpen] = useState(false);

  const handleCloseEditing = (dirty: boolean) => {
    if (dirty) {
      setChangeConfirmationOpen(true);
    } else {
      setAppState((state) => ({
        ...state,
        isEditing: false,
        needRefresh: true,
      }));
    }
  };

  const changeTaskStatus = (
    task: TaskData,
    newStatus: string,
    needComment: boolean
  ) => {
    task.statusId = newStatus;
    if (needComment) {
      setCommentModalOpen(true);
    } else {
      updateTask(task, setAppState);
    }
  };

  const transitionButton = (
    btnText: string,
    handle: () => void,
    suffix: number
  ) => (
    <Button
      key={`transition${suffix}`}
      mt={5}
      marginX={10}
      w={150}
      colorScheme="telegram"
      onClick={handle}
    >
      {btnText}
    </Button>
  );

  return (
    <>
      <Box
        m={5}
        mr="auto"
        maxW="800px"
        w="100%"
        bg="gray.50"
        border="1px"
        borderRadius="lg"
      >
        <Box p={6}>
          <Formik
            enableReinitialize
            initialValues={{
              taskId: taskId || "",
              statusName: statusName || "",
              subject_: subject || "",
              text: text || "",
            }}
            onSubmit={(values) => {
              const taskToFetch = { ...task, ...values, editorId: user.id };
              updateTask(taskToFetch, setAppState);
            }}
          >
            {({ dirty }) => (
              <Form>
                <Flex>
                  <Box maxW="250px">
                    <InputField name="taskId" label="Номер заявки" disabled />
                  </Box>
                  <IconButton
                    variant="solid"
                    aria-label="Закрыть"
                    size="xs"
                    icon={<CloseIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCloseEditing(dirty);
                    }}
                    mt={2}
                    ml="auto"
                  />
                </Flex>
                <Box mt={4} maxW={150}>
                  <InputField name="statusName" label="Статус" disabled />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="subject"
                    label="Тема"
                    disabled={!canBeEdited}
                    required
                  />
                </Box>
                <Box mt={4}>
                  <TextareaField
                    name="text"
                    label="Текст заявки"
                    height="100"
                    disabled={!canBeEdited}
                    required
                  />
                </Box>
                {canBeEdited && (
                  <Button marginY={5} colorScheme="green" type="submit">
                    Сохранить
                  </Button>
                )}
              </Form>
            )}
          </Formik>
          {canBeDeleted && (
            <>
              <Button
                mt={10}
                mr={10}
                w={150}
                colorScheme="red"
                onClick={() => setDeleteConfirmationOpen(true)}
              >
                Удалить
              </Button>
              <ConfirmDialog
                isOpen={isDeleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                action={() => deleteTask(taskId, setAppState)}
                text={{
                  header: "Удалить заявку",
                  body: "Вы уверены? Удаление невозможно отменить.",
                }}
              />
            </>
          )}
          {canTransitToStatuses?.length !== 0 && (
            <>
              <Divider />
              <Wrap justify="center" spacing={10} mt={5}>
                {canTransitToStatuses?.map(({ status, needComment }, i) =>
                  transitionButton(
                    btnName[status],
                    () => changeTaskStatus(task, status, needComment),
                    i
                  )
                )}
              </Wrap>
            </>
          )}
        </Box>
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setCommentModalOpen(false)}
          task={task}
          updateTask={() => updateTask(task, setAppState)}
          user={user}
        />
        <ConfirmDialog
          isOpen={isChangeConfirmationOpen}
          onClose={() => setChangeConfirmationOpen(false)}
          action={() =>
            setAppState((state) => ({
              ...state,
              isEditing: false,
              needRefresh: true,
            }))
          }
          text={{
            header: "Отменить изменения",
            body: "Вы уверены, что не хотят сохранить изменения?",
          }}
        />
      </Box>
      {comments && comments.length !== 0 && <Comments comments={comments} />}
    </>
  );
};

export default EditTaskForm;
