// src/pages/Mypage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import { useForm } from 'react-hook-form';
import apiClient from '../lib/axios';
import Mypage from './Mypage';

import { useState } from 'react';

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
    console.log('使用したい食材:', filteredInclude);
    console.log('使用したくない食材:', filteredExclude);
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
          {/* フォームを作成
            使用したい食材の入力
            複数の食材をブロックで管理
            入れたくないものを入力
            生成ボタン→遷移するようにする
          */}
          <div>
            <label>使用したい食材</label>
            {/* <input
              type="text"
              name="includeIngredients"
              onChange={(e) => {
                const newIngredients = [...includeIngredients];
                newIngredients[0] = e.target.value;
                setIncludeIngredients(newIngredients);
              }}
            /> */}
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
                  onChange={(e) => {
                    const newIngredients = [...includeIngredients];
                    newIngredients[index] = e.target.value;
                    setIncludeIngredients(newIngredients);
                  }}
                  onBlur={() => {
                    const newIngredients = [...includeIngredients];
                    newIngredients[index] = ingredient.trim();
                    setIncludeIngredients(newIngredients);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newIngredients = includeIngredients.filter(
                      (_, i) => i !== index
                    );
                    setIncludeIngredients(newIngredients);
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
                    const newIngredients = [...excludeIngredients];
                    newIngredients[index] = e.target.value;
                    setExcludeIngredients(newIngredients);
                  }}
                  onBlur={() => {
                    const newIngredients = [...excludeIngredients];
                    newIngredients[index] = ingredient.trim();
                    setExcludeIngredients(newIngredients);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newIngredients = excludeIngredients.filter(
                      (_, i) => i !== index
                    );
                    setExcludeIngredients(newIngredients);
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
