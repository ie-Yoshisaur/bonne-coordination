import React from 'react';
import { AppContext } from '../contexts/AppContext';
import './About.css';

const About = () => {
    return (
        <div className="about">
            <h2>Bonne Coordination(ボンコーディネーション)とは?</h2>
            <p>お店に行くことなく、おしゃれになりたい、知らない人に話しかけられないシャイな人向けのアプリです。</p>
            <h2>コミュニケーションなしでおしゃれになれるのか?</h2>
            <p>骨格診断を自分でして、骨格診断の結果をもとに服の提案をします。</p>
            <h2>骨格診断とは?</h2>
            <p>骨格診断は、生まれ持った筋肉や脂肪のつき方や、関節の大きさなどから、自分に合う服がわかる理論です。</p>
            <p>結果はストレート、ウェーブ、ナチュラルの3タイプに分かれます。年齢、身長、体重などは関係なく、一生役に立つメソッドです。</p>
            <p>ナビゲーションのYour Body Typeで骨格診断をして、Clothesであなたに似合う服*1を探すことができます。</p>
            <p>*1骨格診断を熟知しているスタッフが骨格ごとに似合う服を選定しております。</p>
        </div>
    );
};

export default About;
