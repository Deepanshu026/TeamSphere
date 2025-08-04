import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={4}
      bg="rgba(255, 255, 255, 0.10)" // Semi-transparent background
      w={{ base: "100%", md: "68%" }}
      borderRadius="md"
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.3)"
      boxShadow="0 8px 32px 0 rgba(31,38,135,0.25)"
      sx={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)", // For Safari support
        transition: "background 0.3s",
      }}
      maxH={{ base: "calc(100vh - 120px)", md: "calc(100vh - 80px)" }}
      overflowY="auto"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
