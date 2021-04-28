import { Form, Formik } from "formik";
import { Box, Button, useToast } from "@chakra-ui/react";
import React from "react";
import InputField from "./InputField";
import { AppState, TaskData } from "src/types/app";
import TextareaField from "./TextareaField";

type CreateTaskFormProps = {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  userId: string;
};

const STATUS_NEW = "Черновик";
const api = "https://localhost:5001/api/Worktasks/CreateTask";

const createTask = async (task: TaskData) => {
  return await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
};

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  userId,
  setAppState,
}: CreateTaskFormProps) => {
  const alert = useToast();
  return (
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
          initialValues={{ taskId: "", subject: "", text: "" }}
          onSubmit={async (values, actions) => {
            const task = {
              ...values,
              statusName: STATUS_NEW,
              authorId: userId,
            };
            try {
              const response = await createTask(task);
              if (response.ok) {
                actions.resetForm();
                setAppState((state) => ({ ...state, needRefresh: true }));
              } else {
                throw "Номер заявки должен быть уникальным!";
              }
            } catch (e) {
              alert({
                title: `Упс, что-то пошло не так! ${e}`,
                status: "error",
                isClosable: true,
              });
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box maxW="250px">
                <InputField name="taskId" label="Номер заявки" />
              </Box>
              <Box mt={4}>
                <InputField name="subject" label="Тема" required />
              </Box>
              <Box mt={4}>
                <TextareaField
                  name="text"
                  label="Текст заявки"
                  height="200"
                  required
                />
              </Box>
              <Button
                mt={4}
                colorScheme="green"
                isLoading={isSubmitting}
                type="submit"
              >
                Создать
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreateTaskForm;
