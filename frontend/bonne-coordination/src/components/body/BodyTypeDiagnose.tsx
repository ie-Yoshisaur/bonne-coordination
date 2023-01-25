import React, { useContext, useState } from 'react';
import './BodyTypeDiagnose.css';
import { AppContext } from '../../contexts/AppContext';
import fetchBodyType from '../../functions/async/FetchBodyType';

interface BodyTypeCriterion {
  question: string;
  options: {
    text: string;
    image?: string;
  }[];
}

const criteria: BodyTypeCriterion[] = [
    {
        question: '普段着る服はどちらの性別向けですか?',
        options: [
            {
                text: '男性',
            },
            {
                text: '女性',
            },
        ]
    },
    {
        question: '体全体の印象で一番近いものはどれですか?',
        options: [
            {
                text: 'あばら骨の縦幅が気になる',
                image: 'criteria-images/criterion1-straight.png'
            },
            {
                text: 'お尻が横に広い',
                image: 'criteria-images/criterion1-wave.png'
            },
            {
                text: '肩のラインの骨が目立つ',
                image: 'criteria-images/criterion1-natural.png'
            },
        ]
    },
    {
        question: '似合わない服の特徴で一番近いものはどれですか?',
        options: [
            {
                text: 'タイトな服を着るとお腹が出て見える',
            },
            {
                text: 'オーバーサイズの服だと着太りする',
            },
            {
                text: 'タイトな服を着ると骨感でゴツくなる',
            },
        ]
    },
    {
        question: '手のひらの特徴で一番近いものはどれですか?',
        options: [
            {
                text: '指よりも手のひらが長い',
            },
            {
                text: '手のひらが薄い',
            },
            {
                text: '指が長めで、関節が大きい',
            },
        ]
    },
    {
        question: '下半身の印象で一番近いものはどれですか?',
        options: [
            {
                text: 'ふくらはぎから足首のラインにメリハリがある',
                image: 'criteria-images/criterion4-straight.png'
            },
            {
                text: '太ももの付け根が横に張り出している',
                image: 'criteria-images/criterion4-wave.png'
            },
            {
                text: '膝の皿が大きく、アキレス腱が太い',
                image: 'criteria-images/criterion4-natural.png'
            },
        ]
    },
    {
        question: 'お尻の特徴で一番近いものはどれですか?',
        options: [
            {
                text: '上向きに丸い',
                image: 'criteria-images/criterion5-straight.png'
            },
            {
                text: '下向きに丸い',
                image: 'criteria-images/criterion5-wave.png'
            },
            {
                text: '真っ直ぐ',
                image: 'criteria-images/criterion5-natural.png'
            },
        ]
    },
    {
        question: '首の特徴で一番近いものはどれですか?',
        options: [
            {
                text: '首が短い',
            },
            {
                text: '首が細く長い',
            },
            {
                text: '首が太め',
            },
        ]
    },
    {
        question: '筋肉/骨の特徴で一番近いものはどれですか?',
        options: [
            {
                text: '筋肉が付きやすい',
            },
            {
                text: '筋肉が付きにくい',
            },
            {
                text: '全体的に骨太である',
            },
        ]
    },
    {
        question: 'これで質問は以上です',
        options: [
        ]
    },
];

const BodyTypeDiagnose: React.FC = () => {
    const appContext = useContext(AppContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const handleAnswer = (answer: string) => {
        setAnswers(prevAnswers => {
            prevAnswers[currentQuestionIndex] = answer;
            return [...prevAnswers];
        });
        if (currentQuestionIndex < criteria.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevButton = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleSubmitButton = () => {
        const gender = answers[0];
        const bodyImpression = answers[1];
        const unsuitableClothe = answers[2];
        const handImpression = answers[3];
        const legImpression = answers[4];
        const buttocksImpression = answers[5];
        const neckImpression = answers[6];
        const muscleImpression = answers[7];
        fetchBodyType(
            appContext,
            gender,
            bodyImpression,
            unsuitableClothe,
            handImpression,
            legImpression,
            buttocksImpression,
            neckImpression,
            muscleImpression,
        )
            .then(() => {
                if (appContext.bodyType !== '未診断') {
                    appContext.setDoesHaveBodyType(true);
                }
            });
    };

    return (
        <div>
            <h2>{criteria[currentQuestionIndex].question}</h2>
            <div className="note">
                {currentQuestionIndex != criteria.length - 1 ? <p>選択肢はランダムに表示させています。</p> : <></>}
            </div>
            <div className="question-options">
                {shuffleArray(criteria[currentQuestionIndex].options).map((option, index) => (
                    <div
                        key={index}
                        className="question-option"
                        onClick={() => handleAnswer(option.text)}
                    >
                        {option.image && <img src={option.image} alt={option.text} />}
                        <p>{option.text}</p>
                    </div>
                ))}
            </div>
            <div className="buttons">
                {currentQuestionIndex == 0 ? <></> : <button className="prev-button" onClick={() => handlePrevButton()} > 前の質問に戻る </button> }
                {currentQuestionIndex == criteria.length - 1 ? <button className="submit-button" onClick={() => handleSubmitButton()} > 自分の骨格を知る </button> : <></> }
            </div>
        </div>
    );
};

export default BodyTypeDiagnose;

