import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Flex, Heading } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg="white"
      w={{ base: "100%", md: "32%" }}
      borderRadius="xl"
      borderWidth="1px"
      boxShadow="sm"
      minH="80vh"
    >
      <Flex
        w="100%"
        mb={4}
        justifyContent="space-between"
        alignItems="center"
        px={2}
      >
        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="orange.400">
          My Chats
        </Heading>
        <GroupChatModal>
          <Button
            colorScheme="yellow"
            size="md"
            fontWeight="semibold"
            rightIcon={<AddIcon />}
            _hover={{ bg: "yellow.400" }}
            borderRadius="md"
            boxShadow="md"
          >
            New Team
          </Button>
        </GroupChatModal>
      </Flex>

      <Box
        flex={1}
        w="100%"
        bg="black.50"
        borderRadius="lg"
        overflowY="auto"
        boxShadow="inner"
        p={2}
      >
        {chats ? (
          <Stack spacing={3} overflowY="auto" maxH="65vh" px={1}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "yellow.400" : "yellow.200"}
                color={selectedChat === chat ? "black" : "black.300"}
                px={4}
                py={3}
                borderRadius="md"
                boxShadow={selectedChat === chat ? "md" : "sm"}
                _hover={{
                  bg: selectedChat === chat ? "yellow.300" : "black.100",
                }}
                transition="background-color 0.2s ease"
              >
                <Text fontWeight="bold" fontSize="md" mb={1}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text
                    fontSize="sm"
                    color={selectedChat === chat ? "black.100" : "gray.800"}
                    noOfLines={1}
                  >
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
