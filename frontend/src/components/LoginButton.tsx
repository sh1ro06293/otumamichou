import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const LoginButton = () => {
  return (
    <Button
      as={Link}
      to="/login"
      colorScheme="teal"
      size="sm"
      marginLeft={2}
      color="white"
      backgroundColor={"#666"}
    >
      ログインページへ
    </Button>
  );
};

export default LoginButton;