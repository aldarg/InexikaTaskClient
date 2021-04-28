import { Flex, Select, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AppState, User } from "../types/app";
import logo from "../images/logo.png";

interface NavBarProps {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const NavBar: React.FC<NavBarProps> = ({ setAppState }: NavBarProps) => {
  const [users, setUsers] = useState([] as User[]);
  const [loggedIn, setLoggedIn] = useState(false);

  const getUsers = async () => {
    const response = await fetch("https://localhost:5001/api/Users");
    const users = (await response.json()) as User[];
    setUsers(users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleOnChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    const login = users.filter((u) => u.id == value)[0];

    setAppState((state) => ({
      ...state,
      user: { ...login },
      isEditing: false,
      needRefresh: true,
    }));
    setLoggedIn(true);
  };

  return (
    <Flex bg="lightblue" h="80px" p={4}>
      <Image src={logo} maxH="30" />
      <Text marginY="auto" ml={10} fontSize="3xl" color="gray.600">
        Управление заявками
      </Text>
      <Select
        ml="auto"
        marginY="auto"
        maxW="330px"
        bg="lightgrey"
        defaultValue={"DEFAULT"}
        onChange={handleOnChange}
      >
        {!loggedIn && (
          <option disabled value="DEFAULT">
            -- выберите пользователя --
          </option>
        )}
        {users.map(({ id, name, role }) => (
          <option key={"user" + id} value={id}>
            {`${name} [${role}]`}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

export default NavBar;
