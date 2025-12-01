// src/pages/Mypage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import { useForm } from 'react-hook-form';
// import apiClient from '../lib/axios';

import { useState } from 'react';
import { postOtumami } from '../lib/axios';

function Otsumami() {
  const [includeIngredients, setIncludeIngredients] = useState<string[]>([]);
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const { user } = useAuth();
  const { uuid } = useParams();
  const navigate = useNavigate();

  // URLのuuidとログイン中のユーザーのuuidが一致しない場合は不正アクセスとみなす
  // ★★★ .trim() を使って前後の空白を削除してから比較 ★★★
  if (user && uuid && user.uuid.replace(/-/g, '') !== uuid.replace(/-/g, '')) {
    return <div>不正なアクセスです。</div>;
  }

  const mypage = async () => {
    navigate('/mypage/' + user?.uuid);
  };

  const handleGenerate = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    console.log('使用したい食材:', filteredInclude);
    console.log('使用したくない食材:', filteredExclude);
    // ここでAPIリクエストを送信するなどの処理を行う
    postOtumami({
      includeIngredients: filteredInclude,
      excludeIngredients: filteredExclude,
    });
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
            <button type="button" onClick={handleGenerate}>
              生成
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Otsumami;
