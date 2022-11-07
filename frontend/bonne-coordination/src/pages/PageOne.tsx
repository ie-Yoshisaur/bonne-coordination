import React, { ChangeEvent, useContext, useState } from 'react';
import fetchImage from '../functions/async/FetchImage';
import fetchSkeletalType from '../functions/async/FetchSkeletalType';
import { AppContext } from '../contexts/AppContext';

const PageOne = () => {
    const appContext = useContext(AppContext);
    const bodyTypeOptions = [
        {option: '--未選択--'},
        {option: '身体にに厚みのある'},
        {option: '骨がゴツゴツしている'},
        {option: '着痩せしやすい'},
    ];
    const neckThicknessOptions = [
        {option: '--未選択--'},
        {option: '普通'},
        {option: '細い'},
        {option: '太い'},
    ];
    const clavicleTypeOptions = [
        {option: '--未選択--'},
        {option: '普通'},
        {option: '人より目立たない'},
        {option: '人より出ている'},
    ];
    const kneeCapSizeOptions = [
        {option: '--未選択--'},
        {option: '普通'},
        {option: '人より小さい'},
        {option: '人より大きい'},
    ];
    const [bodyType, setBodyType] = useState(bodyTypeOptions[0].option);
    const [neckThickness, setNeckThickness] = useState(neckThicknessOptions[0].option);
    const [clavicleType, setClavicleType] = useState(clavicleTypeOptions[0].option);
    const [kneeCapSize, setKneeCapSize] = useState(kneeCapSizeOptions[0].option);

    const handleBodyTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setBodyType(event.target.value);
    };
    const handleNeckThicknessChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setNeckThickness(event.target.value);
    };
    const handleClavicleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setClavicleType(event.target.value);
    };
    const handleKneeCapSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setKneeCapSize(event.target.value);
    };
    const fetchSkeletalTypeButtonAction = () => { fetchSkeletalType(appContext); };
    const fetchImageButtonAction = () => {
        fetchImage(appContext);
    };

    return (
        <div>
            <p>こんにちは､{appContext?.userName}さん</p>
            <hr></hr>
            <p>体全体の印象は?</p>
            <select value={bodyType} onChange={handleBodyTypeChange}>
                {bodyTypeOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>首の太さは?</p>
            <select value={neckThickness} onChange={handleNeckThicknessChange}>
                {neckThicknessOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>鎖骨の特徴は？</p>
            <select value={clavicleType} onChange={handleClavicleTypeChange}>
                {clavicleTypeOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <p>膝の皿の大きさは?</p>
            <select value={kneeCapSize} onChange={handleKneeCapSizeChange}>
                {kneeCapSizeOptions.map(option => (
                    <option key={option.option} value={option.option}>
                        {option.option}
                    </option>
                ))}
            </select>
            <hr />
            <p>体の印象: {bodyType}</p>
            <p>首の太さ: {neckThickness}</p>
            <p>鎖骨の特徴:{clavicleType}</p>
            <p>膝の皿の大きさ: {kneeCapSize}</p>
            <button type="button" onClick={fetchSkeletalTypeButtonAction}>送信</button>
            <p>あなたの骨格は{appContext?.skeletalType}です</p>
            <hr />
            <button type="button" onClick={fetchImageButtonAction}>似合う服の画像を取得</button>
            <div>
                <img src={appContext?.imageURL}></img>
            </div>
        </div>
    );
};
export default PageOne;

