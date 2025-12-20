// src/pages/Mypage.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Text, Heading } from '@chakra-ui/react';
// import { useForm } from 'react-hook-form';
// import apiClient from '../lib/axios';

import { postOtumami } from '../lib/axios';

function Otsumami() {
  const [includeIngredients, setIncludeIngredients] = useState<string[]>([]);
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const [resData, setResData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { uuid } = useParams();
  const navigate = useNavigate();

  // URLのuuidとログイン中のユーザーのuuidが一致しない場合は不正アクセスとみなす
  // .trim() を使って前後の空白を削除してから比較
  if (user && uuid && user.uuid.replace(/-/g, '') !== uuid.replace(/-/g, '')) {
    return <div>不正なアクセスです。</div>;
  }

  const mypage = async () => {
    navigate('/mypage/' + user?.uuid);
  };

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
      
      // データが返ってきたらセットする
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
    // AuthProviderがロード中の場合や、何らかの理由でuserがnullの場合
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <div>
        <h1>おつまみ生成 Page</h1>
        <button onClick={mypage}>mypage</button>
      </div>
      <div>
        <form>
          <div>
            <label>使用したい食材</label>
            <button
              type="button"
              onClick={() => setIncludeIngredients(['', ...includeIngredients])}
            >
              追加
            </button>
            {includeIngredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="text"
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
                <button
                  type="button"
                  onClick={() => {
                    DeleteItem(
                      index,
                      setIncludeIngredients,
                      includeIngredients
                    );
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          <div>
            <label>使用したくない食材</label>
            <button
              type="button"
              onClick={() => setExcludeIngredients(['', ...excludeIngredients])}
            >
              追加
            </button>
            {excludeIngredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="text"
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
                <button
                  type="button"
                  onClick={() => {
                    DeleteItem(
                      index,
                      setExcludeIngredients,
                      excludeIngredients
                    );
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          <p>
            <button type="button" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? '生成中...' : '生成'}
            </button>
          </p>
        </form>
      </div>
      <div>
        {resData !== null ? (
          <div>
            <h2>{resData.data.name}</h2>
            <h3>材料</h3>
            <p>{resData.data.ingredients}</p>
            <Heading as="h3" size="md">作り方</Heading>
            <Text whiteSpace="pre-wrap">
              {resData.data.instructions}
            </Text>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Otsumami;
