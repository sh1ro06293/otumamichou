
import { Button } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';



export const MypageButton = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const onClickBtn = async () => {
        if (!user) {
            return;
        }
        navigate('/mypage/' + user.uuid);
    };
    return(
    <Button colorScheme="teal" size="md" marginLeft={2} onClick={() => onClickBtn()}>マイページへ</Button>
    );
};

export default MypageButton;