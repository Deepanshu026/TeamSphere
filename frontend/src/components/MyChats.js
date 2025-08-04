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
        headers: { Authorization: `Bearer ${user.token}` },
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
      bg="rgba(255,255,255,0.35)"
      border="1px solid rgba(255,255,255,0.18)"
      boxShadow="0 8px 32px 0 rgba(31,38,135,0.10)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      w={{ base: "100%", md: "32%" }}
      minH="80vh"
    >
      <Flex
        w="100%"
        mb={4}
        justifyContent="space-between"
        alignItems="center"
        px={2}
      >
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          color="orange.500"
          noOfLines={1}
        >
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
            py={2}
          >
            New Team
          </Button>
        </GroupChatModal>
      </Flex>

      <Box
        flex={1}
        w="100%"
        bg="rgba(255,255,255,0.18)"
        borderRadius="lg"
        overflowY="auto"
        boxShadow="inset 0 0 10px rgba(255,255,255,0.12)"
        backdropFilter="blur(10px)"
        p={2}
      >
        {chats ? (
          <Stack spacing={3} overflowY="auto" maxH="65vh" px={1}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "yellow.400" : "yellow.100"}
                color={selectedChat === chat ? "black" : "blackAlpha.700"}
                px={4}
                py={3}
                borderRadius="lg"
                boxShadow={selectedChat === chat ? "md" : "sm"}
                _hover={{
                  boxShadow: "0 4px 24px 0 rgba(31,38,135,0.08)",
                  transform: "translateY(-2px)",
                  bg: selectedChat === chat ? "yellow.300" : "yellow.200",
                  color: selectedChat === chat ? "black" : "black",
                  transition: "all 0.2s",
                }}
                mb={2}
                transition="all 0.2s"
              >
                <Text fontWeight="bold" fontSize="md" mb={1}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="sm" color="blackAlpha.600" noOfLines={1}>
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
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
