import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import './BodyTypeExplanation.css';

interface Props {
    bodyType: string;
}

const BodyTypeExplanation = () => {
    const appContext = useContext(AppContext);

    let explanation = '';
    let imageUrl = '';

    if (appContext.bodyType === 'ストレート') {
        explanation = 'ストレートの人は、立体感があるメリハリボディ。ベーシックな服が似合います。過度な装飾は避けてシックにまとめると良いでしょう。';
        imageUrl = 'body-types/straight.png';
    } else if (appContext.bodyType === 'ウェーブ') {
        explanation = 'ウェーブの人は、厚みがなく華奢な曲線ボディ。薄手で柔らかい素材の服が似合います。寂しい印象にならないよう、装飾のある服がおすすめ。';
        imageUrl = 'body-types/wave.png';
    } else if (appContext.bodyType === 'ナチュラル') {
        explanation = 'ナチュラルの人は、フレーム感のあるスタイリッシュなボディ。洗いざらいなどの風合を感じる素材で、ゆったりラフなコーディネートが似合います。';
        imageUrl = 'body-types/natural.png';
    }

    return (
        <div className="body-type-explanation">
            <h2>{appContext.userName}さんは、{appContext.bodyType}です。</h2>
            <p>{explanation}</p>
            <img src={imageUrl} alt={`${appContext.bodyType}`} />
        </div>
    );
};

export default BodyTypeExplanation;

