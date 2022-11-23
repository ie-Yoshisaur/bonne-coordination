import React, { ChangeEvent, useContext, useState } from 'react';
import fetchSkeletalType from '../functions/async/FetchSkeletalType';
import { AppContext } from '../contexts/AppContext';

const PageOne = () => {
    const appContext = useContext(AppContext);
    const [errorMessageOfSkeletalDiagnosis, setErrorMessageOfSkeletalDiagnosis] = useState('');
    const bodyImpressionOptions = [
        {option: '--未選択--'},
        {option: '厚みがあり、肉厚的'},
        {option: '厚みは少なく、すらりとしている'},
        {option: '骨や筋が目立つ'},
    ];

    const fingerJointSizeOptios = [
        {option: '--未選択--'},
        {option: '小さめ'},
        {option: 'ふつう'},
        {option: '大きい'},
    ];

    const wristShapeOptions = [
        {option: '--未選択--'},
        {option: '断面にすると丸に近い形'},
        {option: '幅が広くてうすく、断面にすると平べったい形'},
        {option: '骨が目立ち、しっかりしている'},
    ];

    const wristAnkcleOptions = [
        {option: '--未選択--'},
        {option: 'ほとんど見えないくらい小さい'},
        {option: 'ふつうに見える程度の大きさ'},
        {option: 'とてもはっきり出ている、または大きい'},
    ];

    const clavicleImpressionOptions = [
        {option: '--未選択--'},
        {option: 'ほとんど見えないくらい小さい'},
        {option: '見えるが細め'},
        {option: '大きくしっかりしている'},
    ];

    const kneecapImpressionOptions = [
        {option: '--未選択--'},
        {option: '小さめで、あまり存在感がない'},
        {option: '中くらいの大きさ、触ると前に出ている'},
        {option: '大きい'},
    ];

    const unsuitableClotheOptions = [
        {option: '--未選択--'},
        {option: 'スキニーパンツ'},
        {option: '革ジャケット'},
        {option: '無地の小さめTシャツ'},
    ];
    const [bodyImpression, setBodyImpression] = useState(bodyImpressionOptions[0].option);
    const [fingerJointSize, setFingerJointSize] = useState(fingerJointSizeOptios[0].option);
    const [wristShape, setWristShape] = useState(wristShapeOptions[0].option);
    const [wristAnkcle, setWristAnkcle] = useState(wristAnkcleOptions[0].option);
    const [clavicleImpression, setClavicleImpression] = useState(clavicleImpressionOptions[0].option);
    const [kneecapImpression, setKneecapImpressionOptions] = useState(kneecapImpressionOptions[0].option);
    const [unsuitableClothe, setUnsuitableClothe] = useState(unsuitableClotheOptions[0].option);

    const handleBodyImpressionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setBodyImpression(event.target.value);
    };
    const handleFingerJointSizeOptioChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFingerJointSize(event.target.value);
    };
    const handleWristShapeOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setWristShape(event.target.value);
    };
    const handleWristAnkcleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setWristAnkcle(event.target.value);
    };
    const handleClavicleImpressionOption = (event: ChangeEvent<HTMLSelectElement>) => {
        setClavicleImpression(event.target.value);
    };
    const handleKneecapImpressionOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setKneecapImpressionOptions(event.target.value);
    };
    const handleUnsuitableClotheOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setUnsuitableClothe(event.target.value);
    };
    const fetchSkeletalTypeButtonAction = () => {
        if (
            bodyImpression === '--未選択--' ||
            fingerJointSize === '--未選択--' ||
            wristShape === '--未選択--' ||
            wristAnkcle === '--未選択--' ||
            clavicleImpression === '--未選択--' ||
            kneecapImpression === '--未選択--' ||
            unsuitableClothe === '--未選択--'
        ) {
            const errorMessage = '未選択の項目があります';
            setErrorMessageOfSkeletalDiagnosis(errorMessage);
        } else {
            setErrorMessageOfSkeletalDiagnosis('');
            fetchSkeletalType(
                appContext,
                bodyImpression,
                fingerJointSize,
                wristShape,
                wristAnkcle,
                clavicleImpression,
                kneecapImpression,
                unsuitableClothe,
            );
        }
    };

    return (
        <div>
            <p>体全体の印象は?</p>
            <select value={bodyImpression} onChange={handleBodyImpressionChange}>
                {bodyImpressionOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>指の関節の大きさは?</p>
            <select value={fingerJointSize} onChange={handleFingerJointSizeOptioChange}>
                {fingerJointSizeOptios.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>手首の特徴は?</p>
            <select value={wristShape} onChange={handleWristShapeOptionChange}>
                {wristShapeOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>手首のくるぶしのような骨の特徴は?</p>
            <select value={wristAnkcle} onChange={handleWristAnkcleOptionChange}>
                {wristAnkcleOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>鎖骨の特徴は?</p>
            <select value={clavicleImpression} onChange={handleClavicleImpressionOption}>
                {clavicleImpressionOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>ひざの皿の特徴は?</p>
            <select value={kneecapImpression} onChange={handleKneecapImpressionOptionChange}>
                {kneecapImpressionOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>あまり似合わない服は?</p>
            <select value={unsuitableClothe} onChange={handleUnsuitableClotheOptionChange}>
                {unsuitableClotheOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <hr />
            <p>{errorMessageOfSkeletalDiagnosis}</p>
            <button type="button" onClick={fetchSkeletalTypeButtonAction}>送信</button>
            <p>{appContext?.userName}さんの骨格は{appContext?.skeletalType}です</p>
        </div>
    );
};
export default PageOne;
