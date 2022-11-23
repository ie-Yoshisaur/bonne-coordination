import React, { ChangeEvent, useState, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '../../contexts/AppContext';
import signUp from '../../functions/async/SignUp';

function SignUpModal() {
    const appContext = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => { setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); };
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmination, setPasswordConfirmination] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handlePasswordConfirminationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirmination(e.target.value);
    };
    const handleSignUp = () => {
        signUp(appContext, userName, password, passwordConfirmination)
            .then(() => {
                if (appContext?.isSignedIn) {
                    closeModal();
                } else {
                    const errorMessageOfSignUp = '無効な入力です。（原因: すでに存在するユーザー名、無効なパスワードなど）';
                    setErrorMessage(errorMessageOfSignUp);
                }
            });
    };
    const handleCancel = () => {
        setUserName('');
        setPassword('');
        setPasswordConfirmination('');
        setErrorMessage('');
        closeModal();
    };
    return (
        <div>
            <button type="button" onClick={openModal}>サインアップ</button>
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
            >
                <button onClick={() => handleCancel()}>キャンセル</button>
                <div className='user-name'>
                    <label>ユーザー名</label>
                    <input type="text" value={userName} onChange={handleNameChange} placeholder='ユーザー名'></input>
                </div>
                <div className='password'>
                    <label>パスワード</label>
                    <input type="password" value={password} onChange={handlePasswordChange}placeholder='パスワード'></input>
                </div>
                <div className='password-confirmination'>
                    <label>パスワード(確認用)</label>
                    <input type="password" value={passwordConfirmination} onChange={handlePasswordConfirminationChange} placeholder='パスワード(確認用)'></input>
                </div>
                <p>{errorMessage}</p>
                <button onClick={() => handleSignUp()}>送信</button>
            </Modal>
        </div>
    );
}
export default SignUpModal;
