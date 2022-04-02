import { Box } from "@chakra-ui/react";
import React from "react";

type Props = {
  variant?: "small" | "regular";
  children: any;
};

const Wrapper = ({ variant, children }: Props) => {
  return (
    <Box
      maxW={variant.toString() === "regualar" ? "800px" : "400px"}
      w="100%"
      mt="8"
      mx="auto"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
