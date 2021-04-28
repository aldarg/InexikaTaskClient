import { ArrowDownIcon, EditIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import getApiUrl from "../utils/getApiUrl";
import { AppState, TaskData, User } from "../types/app";
import InputField from "./InputField";
import { getViewSettings } from "./settings";

interface TaskListProps {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  refresh?: boolean;
  user: User;
}

const sortTasks = (tasks: TaskData[], sort: string) => {
  return tasks.sort((a, b) => ("" + a[sort]).localeCompare(b[sort]));
};

const TaskList: React.FC<TaskListProps> = ({
  setAppState,
  refresh,
  user,
}: TaskListProps) => {
  const [tasks, setTasks] = useState([] as TaskData[]);
  const [sortField, setSortField] = useState("taskId");

  const fetchTasks = async (textToSearch = "") => {
    const method = "GetTasks";
    const query = `?userid=${user.id}&textToSearch=${textToSearch}&sort=${sortField}`;
    const url = getApiUrl(method, query);

    const response = await fetch(url);
    if (response.ok) {
      const fetchedTasks = (await response.json()) as TaskData[];
      setTasks(sortTasks(fetchedTasks, sortField));
      setAppState((state) => ({
        ...state,
        isEditing: false,
        needRefresh: false,
      }));
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, sortField]);

  const handleEdit = (task: string) => {
    return () =>
      setAppState((state) => ({
        ...state,
        isEditing: true,
        editedTaskId: task,
      }));
  };

  const { columns, width } = getViewSettings(user.role);
  const headers = Object.keys(columns);

  return (
    <Box m={5} {...(width ? { w: width } : {})}>
      <Formik
        enableReinitialize
        initialValues={{ search: "" }}
        onSubmit={async (values) => {
          fetchTasks(values.search);
        }}
      >
        {() => (
          <Form>
            <Flex mr="auto" mb={10} w={600}>
              <InputField name="search" label="Поиск по тексту" />
              <Button
                mt="auto"
                ml={5}
                colorScheme="green"
                size="sm"
                type="submit"
              >
                Искать
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
      <Table variant="striped" size="sm" colorScheme="gray">
        <Thead>
          <Tr mb={2}>
            <Th></Th>
            {headers.map((header) => (
              <Th key={"header" + header}>
                {columns[header]}
                <IconButton
                  size="xs"
                  variant="ghost"
                  mb={1}
                  aria-label="сортировать"
                  icon={<ArrowDownIcon />}
                  onClick={() => setSortField(header)}
                />
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {!!tasks &&
            tasks.map((task) => (
              <Tr key={"task" + task.taskId} role="group">
                <Td _groupHover={{ background: "lightblue" }}>
                  <IconButton
                    variant="solid"
                    aria-label="Редактировать заявку"
                    colorScheme="green"
                    size="sm"
                    icon={<EditIcon />}
                    onClick={handleEdit(task.taskId)}
                  />
                </Td>
                {headers.map((header) => (
                  <Td
                    key={"taskfield" + header}
                    _groupHover={{ background: "lightblue" }}
                  >
                    {task[header]}
                  </Td>
                ))}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TaskList;
