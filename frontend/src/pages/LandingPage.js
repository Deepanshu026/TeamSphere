import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      w="100%"
      bgGradient="linear(to-br, orange.50, orange.100, orange.200)"
      align="center"
      justify="center"
      px={6}
      py={14}
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        top="-100px"
        left="-100px"
        w="300px"
        h="300px"
        bg="orange.200"
        borderRadius="full"
        filter="blur(100px)"
        opacity={0.5}
      />
      <Box
        position="absolute"
        bottom="-100px"
        right="-100px"
        w="300px"
        h="300px"
        bg="orange.300"
        borderRadius="full"
        filter="blur(100px)"
        opacity={0.5}
      />

      <Box
        w={{ base: "100%", md: "600px" }}
        bg="whiteAlpha.800"
        borderRadius="2xl"
        p={{ base: 8, md: 14 }}
        boxShadow="xl"
        backdropFilter="blur(20px)"
        textAlign="center"
        zIndex={1}
      >
        <VStack spacing={8}>
          
          <Icon
            as={ChatIcon}
            boxSize={20}
            color="orange.400"
            filter="drop-shadow(0px 0px 10px rgba(255,184,76,0.7))"
          />

          <Heading
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="extrabold"
            color="orange.500"
          >
            Welcome to{" "}
            <Text as="span" color="orange.400">
              TeamSphere
            </Text>
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.700" px={4}>
            Chat smarter and faster. Connect instantly with colleagues — anywhere, anytime.
          </Text>

          <Button
            size="lg"
            colorScheme="orange"
            borderRadius="full"
            px={14}
            py={6}
            fontWeight="bold"
            boxShadow="0 8px 25px rgba(255,184,76,0.5)"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 12px 30px rgba(255,184,76,0.7)",
            }}
            _active={{
              transform: "scale(0.97)",
            }}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </VStack>
      </Box>

      
      <Text mt={10} fontSize="sm" color="orange.500" zIndex={1}>
        © 2025 TeamSphere. All rights reserved.
      </Text>
    </Flex>
  );
}
