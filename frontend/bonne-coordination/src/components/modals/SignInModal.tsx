import React, { ChangeEvent, useState, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '../../contexts/AppContext';
import signIn from '../../functions/async/SignIn';

function SignInModal() {
    const appContext = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => { setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); };
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleSignIn = () => {
        signIn(appContext, userName, password)
            .then(() => {
                if (appContext?.isSignedIn) {
                    closeModal();
                } else {
                    const errorMessageOfSignIn = '認証に失敗しました。（原因: 存在しないユーザー名、違うパスワードなど）';
                    setErrorMessage(errorMessageOfSignIn);
                }
            });
    };
    const handleCancel = () => {
        setUserName('');
        setPassword('');
        setErrorMessage('');
        closeModal();
    };
    return (
        <div>
            <button type="button" onClick={openModal}>サインイン</button>
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
                <p>{errorMessage}</p>
                <button onClick={() => handleSignIn()}>送信</button>
            </Modal>
        </div>
    );
}
export default SignInModal;

