import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { AppContext } from '../../contexts/AppContext';
import signIn from '../../functions/async/SignIn';
import './Modal.css';

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
                    console.log('hoo');
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
            <div className='when-modal-is-close'>
                <button type="button" onClick={openModal}>Sign In</button>
            </div>
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                className='modal-content'
            >
                <button className='close-btn' onClick={() => handleCancel()}>&times;</button>
                <input className="input" type="text" placeholder="Username" onChange={handleNameChange} value={userName} />
                <input className="input" type="password" placeholder="Password" onChange={handlePasswordChange} value={password} />
                <p>{errorMessage}</p>
                <button className="submit" onClick={() => handleSignIn()}>Sign In</button>
            </Modal>
        </div>
    );
}
export default SignInModal;

