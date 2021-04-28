import { Box, Heading, Text } from "@chakra-ui/layout";
import { StackDivider, VStack } from "@chakra-ui/react";
import React from "react";
import { TaskComment } from "src/types/app";

interface CommentsProps {
  comments: TaskComment[];
}

const Comments: React.FC<CommentsProps> = ({ comments }: CommentsProps) => {
  return (
    <VStack
      ml={5}
      mr="autp"
      maxW="400px"
      w="100%"
      divider={<StackDivider borderColor="gray.200" />}
      spacing={2}
    >
      {comments.map(({ authorName, text, createDate }, i) => (
        <Box
          key={`comment${i}`}
          p={5}
          w="100%"
          bg="gray.50"
          border="1px"
          borderRadius="md"
        >
          <Heading size="md" mb={3}>
            Комментарий к заявке
          </Heading>
          <Text fontSize="sm">Автор: {authorName}</Text>
          <Text fontSize="sm" mb={3}>
            Дата: {createDate}
          </Text>
          <Text fontSize="sm">{text}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default Comments;
