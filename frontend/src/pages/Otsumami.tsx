

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Text, Heading, Box, Flex, Button, Input} from '@chakra-ui/react';



import { postOtumami } from '../lib/axios';
import MypageButton from '../components/MypageButton';

function Otsumami() {
  const [includeIngredients, setIncludeIngredients] = useState<string[]>([]);
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const [resData, setResData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { uuid } = useParams();


  if (user && uuid && user.uuid.replace(/-/g, '') !== uuid.replace(/-/g, '')) {
    return <div>不正なアクセスです。</div>;
  }



  const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const filteredInclude = includeIngredients.filter(
      (ingredient) => ingredient.trim() !== ''
    );
    const filteredExclude = excludeIngredients.filter(
      (ingredient) => ingredient.trim() !== ''
    );

    if (filteredInclude.length === 0) {
      alert('使用したい食材を指定してください。');
      return;
    }

    setIsLoading(true);
    setResData(null);

    try {

      const data = await postOtumami({
        IncludeIngredients: filteredInclude,
        ExcludeIngredients: filteredExclude,
      });
      

      setResData(data);
      
    } catch (error) {
      console.error("API Error:", error);
      alert("生成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    Items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newItem = [...Items];
    newItem[index] = e.target.value;
    setItems(newItem);
  };

  const onBlurItem = (
    Items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    itemValue: string
  ) => {
    const newItems = [...Items];
    newItems[index] = itemValue.trim();
    setItems(newItems);
  };

  const DeleteItem = (
    index: number,
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    items: string[]
  ) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  if (!user) {

    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <div>
        <Text textStyle="6xl" marginBottom={4}>おつまみ生成</Text> 
        <MypageButton />
      </div>
      <div>
        <form>
          <Flex>
        <Box flex="1" p="4">
          <Heading size="md" mb="4">使用したい食材</Heading>
          <Button
            colorScheme="teal"
            size="sm"
            background={"#666"}
            onClick={() => setIncludeIngredients(['', ...includeIngredients])}
          >
            追加
          </Button>
          {includeIngredients.map((ingredient, index) => (
            <Flex key={index} mt="2" align="center">
              <Input
                size="sm"
                value={ingredient}
                onChange={(e) =>
                  addItem(e, index, includeIngredients, setIncludeIngredients)
                }
                onBlur={() => {
                  onBlurItem(
                    includeIngredients,
                    setIncludeIngredients,
                    index,
                    ingredient
                  );
                }}
              />
              <Button
                ml="2"
                size="sm"
                colorScheme="red"
                background={"#666"}
                onClick={() => {
                  DeleteItem(
                    index,
                    setIncludeIngredients,
                    includeIngredients
                  );
                }}
              >
                削除
              </Button>
            </Flex>
          ))}
        </Box>
        <Box flex="1" p="4">
          <Heading size="md" mb="4">使用したくない食材</Heading>
          <Button
            colorScheme="teal"
            size="sm"
            background={"#666"}
            onClick={() => setExcludeIngredients(['', ...excludeIngredients])}
          >
            追加
          </Button>
          {excludeIngredients.map((ingredient, index) => (
            <Flex key={index} mt="2" align="center">
              <Input
                size="sm"
                value={ingredient}
                onChange={(e) => {
                  addItem(
                    e,
                    index,
                    excludeIngredients,
                    setExcludeIngredients
                  );
                }}
                onBlur={() => {
                  onBlurItem(
                    excludeIngredients,
                    setExcludeIngredients,
                    index,
                    ingredient
                  );
                }}
              />
              <Button
                ml="2"
                size="sm"
                colorScheme="red"
                background={"#666"}
                onClick={() => {
                  DeleteItem(
                    index,
                    setExcludeIngredients,
                    excludeIngredients
                  );
                }}
              >
                削除
              </Button>
            </Flex>
          ))}
        </Box>
      </Flex>
          <p>
            <Button type="button" onClick={handleGenerate} disabled={isLoading} background={"#666"} marginLeft={4} marginTop={4}>
              {isLoading ? '生成中...' : '生成'}
            </Button>
          </p>
        </form>
      </div>
      <div>
        {resData !== null ? (
          <Flex direction="column" marginTop={6} marginLeft={4}>
            <Text textStyle="4xl" marginBottom={4}>{resData.data.name}</Text>
            <Heading as="h3" size="md" marginBottom={2}>材料</Heading>
            <Text whiteSpace="pre-wrap">{resData.data.ingredients}</Text>
            <Heading as="h3" size="md" marginBottom={2} marginTop={3}>作り方</Heading>
            <Text whiteSpace="pre-wrap">
              {resData.data.instructions}
            </Text>
          </Flex>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Otsumami;
