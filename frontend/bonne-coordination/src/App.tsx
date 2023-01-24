import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { Link } from 'react-router-dom';
import SignUpModal from './components/modals/SignUpModal';
import SignInModal from './components/modals/SignInModal';
import SignInWithJwt from './functions/async/SignInWithJwt';
import Main from './Main';
import './App.css';

export default function App() {
    const appContext = useContext(AppContext);
    useEffect(() => {
        SignInWithJwt(appContext);
    }, []);
    const SignUpOrSignIn = () => {
        if (!appContext?.isSignedIn) {
            return (
                <>
                    <div className='modals'>
                      <SignUpModal />
                      <SignInModal />
                    </div>
                </ >
            );
        }
        return (
            <>
            </ >
        );
    };
    return (
        <>
            <div className='App'>
                <div className='header'>
                  <h1>Bonne Coordination</h1>
                  <SignUpOrSignIn />
                </div>
                <div className='nav'>
                  <ul>
                      <li><Link to='/'>Home</Link></li>
                      <li><Link to='/about'>About</Link></li>
                      <li><Link to='/body-type'>Your Body Type</Link></li>
                      <li><Link to='/clothes'>Clothes</Link></li>
                  </ul>
                </div>
                <hr />
                <div className='body'>
                  <Main />
                </div>
                <hr />
                <div className='footer'>
                  <p>Copyright ©2023 skeleton</p>
                </div>
            </div>
        </>
    );
}
