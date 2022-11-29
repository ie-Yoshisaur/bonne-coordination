import React, { ChangeEvent, useState, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '../../contexts/AppContext';
import fetchSkeletalType from '../../functions/async/FetchSkeletalType';

function DiagnosisModal() {
    const appContext = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => { setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); };
    const handleCancel = () => {
        closeModal();
    };

    const [pageCount, setPageCount] = useState(0);
    const decreasePageCount = () => {
        if (pageCount !== 0) {
            setPageCount(pageCount - 1);
        }
    };
    const increasePageCount = () => {
        if (pageCount !== 6 && answers[pageCount] !== '--未選択--') {
            setPageCount(pageCount + 1);
        }
    };

    const [bodyImpression, setBodyImpression] = useState('--未選択--');
    const [fingerJointSize, setFingerJointSize] = useState('--未選択--');
    const [wristShape, setWristShape] = useState('--未選択--');
    const [wristAnkcle, setWristAnkcle] = useState('--未選択--');
    const [clavicleImpression, setClavicleImpression] = useState('--未選択--');
    const [kneecapImpression, setKneecapImpressionOptions] = useState('--未選択--');
    const [unsuitableClothe, setUnsuitableClothe] = useState('--未選択--');

    const answers = [
        bodyImpression,
        fingerJointSize,
        wristShape,
        wristAnkcle,
        clavicleImpression,
        kneecapImpression,
        unsuitableClothe,
    ];

    const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (pageCount === 0) {
            setBodyImpression(event.target.value);
        } else if (pageCount === 1) {
            setFingerJointSize(event.target.value);
        } else if (pageCount === 2) {
            setWristShape(event.target.value);
        } else if (pageCount === 3) {
            setWristAnkcle(event.target.value);
        } else if (pageCount === 4) {
            setClavicleImpression(event.target.value);
        } else if (pageCount === 5) {
            setKneecapImpressionOptions(event.target.value);
        } else if (pageCount === 6) {
            setUnsuitableClothe(event.target.value);
        }
    };

    const fetchSkeletalTypeButtonAction = () => {
        fetchSkeletalType(
            appContext,
            bodyImpression,
            fingerJointSize,
            wristShape,
            wristAnkcle,
            clavicleImpression,
            kneecapImpression,
            unsuitableClothe,
        )
            .then(() => {
                if (appContext!.skeletalType !== '未診断') {
                    appContext!.setDoesHaveSkeletalType(true);
                    closeModal();
                }
            });
    };

    const questions = [
        '体全体の印象は?',
        '指の関節の大きさは?',
        '手首の特徴は?',
        '手首のくるぶしのような骨の特徴は?',
        '鎖骨の特徴は?',
        'ひざの皿の特徴は?',
        'あまり似合わない服は?',
    ];

    const optionDictArr: Array<Array<{option: string}>> = [
        [
            {option: '--未選択--'},
            {option: '厚みがあり、肉厚的'},
            {option: '厚みは少なく、すらりとしている'},
            {option: '骨や筋が目立つ'},
        ],
        [
            {option: '--未選択--'},
            {option: '小さめ'},
            {option: 'ふつう'},
            {option: '大きい'},
        ],
        [
            {option: '--未選択--'},
            {option: '断面にすると丸に近い形'},
            {option: '幅が広くてうすく、断面にすると平べったい形'},
            {option: '骨が目立ち、しっかりしている'},
        ],
        [
            {option: '--未選択--'},
            {option: 'ほとんど見えないくらい小さい'},
            {option: 'ふつうに見える程度の大きさ'},
            {option: 'とてもはっきり出ている、または大きい'},
        ],
        [
            {option: '--未選択--'},
            {option: 'ほとんど見えないくらい小さい'},
            {option: '見えるが細め'},
            {option: '大きくしっかりしている'},
        ],
        [
            {option: '--未選択--'},
            {option: '小さめで、あまり存在感がない'},
            {option: '中くらいの大きさ、触ると前に出ている'},
            {option: '大きい'},
        ],
        [
            {option: '--未選択--'},
            {option: '小さめで、あまり存在感がない'},
            {option: '中くらいの大きさ、触ると前に出ている'},
            {option: '大きい'},
        ],
        [
            {option: '--未選択--'},
            {option: 'スキニーパンツ'},
            {option: '革ジャケット'},
            {option: '無地の小さめTシャツ'},
        ],
    ];

    return (
        <div>
            <button type="button" onClick={openModal}>骨格診断をする</button>
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
            >
                <button onClick={() => handleCancel()}>キャンセル</button>
                <p>{questions[pageCount]}</p>
                <select value={answers[pageCount]} onChange={handleOptionChange}>
                    {optionDictArr[pageCount].map(option => (
                        <option key={option.option} value={option.option}>
                            {option.option}
                        </option>
                    ))}
                </select>
                {pageCount !== 0 ? <button onClick={() => decreasePageCount()}>戻る</button>: <></ >}
                {pageCount !== 6 ? <button onClick={() => increasePageCount()}>進む</button>: <></ >}
                {pageCount === 6 && answers[pageCount] !== '--未選択--' ? <button onClick={() => fetchSkeletalTypeButtonAction()}>骨格診断の結果を取得する</button>: <></ >}
            </Modal>
        </div>
    );
}
export default DiagnosisModal;

