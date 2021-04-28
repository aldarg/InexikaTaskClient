import React, { useState } from "react";
import "./styles/styles.sass";
import NavBar from "./components/NavBar";
import EditTaskForm from "./components/EditTaskForm";
import TaskList from "./components/TaskList";
import CreateTaskForm from "./components/CreateTaskForm";
import { AppState } from "./types/app";
import { Box } from "@chakra-ui/react";

const App: React.FC = () => {
  const [
    { user, isEditing, editedTaskId, needRefresh },
    setAppState,
  ] = useState({} as AppState);

  return (
    <Box w="100%" mb={10}>
      <NavBar setAppState={setAppState} />
      {user && (
        <>
          <TaskList
            setAppState={setAppState}
            refresh={needRefresh}
            user={user}
          />
          {isEditing && editedTaskId && (
            <EditTaskForm
              editedTaskId={editedTaskId}
              setAppState={setAppState}
              user={user}
            />
          )}
          {user?.canCreate && !isEditing && (
            <CreateTaskForm userId={user.id} setAppState={setAppState} />
          )}
        </>
      )}
    </Box>
  );
};

export default App;
