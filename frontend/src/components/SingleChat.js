import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text, Flex } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT = "http://localhost:5000";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const selectedChatCompare = useRef();
  const lastTypingTime = useRef(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINT);
    }
  }, []);

  useEffect(() => {
    if (user && socket) {
      socket.emit("setup", user);

      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      return () => {
        socket.off("connected");
        socket.off("typing");
        socket.off("stop typing");
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare.current = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      if (
        !selectedChatCompare.current ||
        selectedChatCompare.current._id !== newMessageReceived.chat._id
      ) {
        setFetchAgain((prev) => !prev);
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    if (socket) {
      socket.on("message recieved", handleNewMessage);
    }

    return () => {
      if (socket) socket.off("message recieved", handleNewMessage);
    };
    // eslint-disable-next-line
  }, []);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    lastTypingTime.current = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime.current;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Flex
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            justifyContent="space-between"
            alignItems="center"
            bg="rgba(255,255,255,0.15)" // Glassy header background
            borderRadius="md"
            backdropFilter="blur(10px)"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.3)"
            boxShadow="0 8px 32px 0 rgba(31,38,135,0.1)"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              aria-label="Back"
              colorScheme="yellow"
              variant="ghost"
              fontSize="20px"
            />
            <Text
              flex="1"
              fontWeight="bold"
              color="yellow.400"
              mx={3}
              noOfLines={1}
            >
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </>
                ))}
            </Text>
          </Flex>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={4}
            bg="rgba(255, 255, 255, 0.10)" // glassy background
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            boxShadow="inset 0 0 10px rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(8px)"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color="yellow.400"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={4}>
              {istyping && (
                <Box mb={3}>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginLeft: 0 }}
                  />
                </Box>
              )}
              <Input
                variant="filled"
                bg="yellow.100"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                _focus={{ bg: "yellow.200" }}
                borderRadius="md"
                boxShadow="sm"
                transition="background 0.3s"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          p={4}
          bg="rgba(255, 255, 255, 0.10)" // glassy empty state
          borderRadius="lg"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(8px)"
          textAlign="center"
        >
          <Text fontSize="3xl" fontFamily="Work sans" color="black.800" px={4}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
