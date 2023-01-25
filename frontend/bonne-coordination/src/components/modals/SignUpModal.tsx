import React, { ChangeEvent, useState, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '../../contexts/AppContext';
import signUp from '../../functions/async/SignUp';
import './Modal.css';

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
                if (appContext.isSignedIn) {
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
            <div className='when-modal-is-close'>
                <button type="button" onClick={openModal}>Sign Up</button>
            </div>
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                className='modal-content'
            >
                <button className='close-btn' onClick={() => handleCancel()}>&times;</button>
                <input className="input" type="text" placeholder="Username" onChange={handleNameChange} value={userName} />
                <input className="input" type="password" placeholder="Password" onChange={handlePasswordChange} value={password} />
                <input className="input" type="password" value={passwordConfirmination} onChange={handlePasswordConfirminationChange} placeholder='パスワード(確認用)'></input>
                <p>{errorMessage}</p>
                <button className="submit" onClick={() => handleSignUp()}>Sign Up</button>
            </Modal>
        </div>
    );
}
export default SignUpModal;
