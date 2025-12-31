import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoutButton } from '../components/LogoutButton';
import { MypageButton } from '../components/MypageButton';
import { LoginButton } from '../components/LoginButton';
import { HStack, Text } from "@chakra-ui/react";

function Home() {
  const { user } = useAuth();

  return (
    <div>
      <Text textStyle="6xl">Home Page</Text>
      {user ? (
        <div>
          <Text textStyle="md" marginBottom={3}>ようこそ, {user.name}さん！</Text>
          <HStack wrap="wrap" gap="2">
            <MypageButton />
            <LogoutButton />
          </HStack>
        </div>
      ) : (
        <div>
          <Text textStyle="md" marginBottom={3}>ログインしていません。</Text>
          <LoginButton />
        </div>
      )}
    </div>
  );
}

export default Home;
