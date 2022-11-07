import React, {useState, useContext} from 'react';
import { AppContext } from '../contexts/AppContext';

const Home = () => {
    const appContext = useContext(AppContext);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmination, setPasswordConfirmination] = useState('');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handlePasswordConfirminationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirmination(e.target.value);
    };
    const signUp = () => {
        const signUpUrl = 'http://localhost/api/sign-up';
        fetch(signUpUrl, {
            method: 'POST',
            body: JSON.stringify({
                name,
                password,
                passwordConfirmination,
            })
        })
            .then((response) => {
                if (response.status === 200) {
                    return Promise.resolve(response.json());
                }
                return Promise.reject();
            })
            .then((json) => {
                appContext?.setUserName(json?.name);
                return Promise.resolve();
            }); 
    };
            
    return (
        <>
            <div className='user-name'>
                <label>ユーザー名</label>
                <input type="text" value={name} onChange={handleNameChange} placeholder='ユーザー名'></input>
            </div>
            <div className='password'>
                <label>パスワード</label>
                <input type="password" value={password} onChange={handlePasswordChange}placeholder='パスワード'></input>
            </div>
            <div className='password-confirmination'>
                <label>パスワード(確認用)</label>
                <input type="password" value={passwordConfirmination} onChange={handlePasswordConfirminationChange} placeholder='パスワード(確認用)'></input>
            </div>
            <button onClick={() => signUp()}>送信</button>
        </>
    );
};

export default Home;
