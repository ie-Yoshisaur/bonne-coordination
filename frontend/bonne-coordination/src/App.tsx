import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { NavLink } from 'react-router-dom';
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
        if (!appContext.isSignedIn) {
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
                        <li><NavLink to='/' className={({ isActive }) => isActive? 'font-bold' : 'font-thin'} >Home</NavLink></li>
                        <li><NavLink to='/about' className={({ isActive }) => isActive? 'font-bold' : 'font-thin'} >About</NavLink></li>
                        <li><NavLink to='/body-type' className={({ isActive }) => isActive? 'font-bold' : 'font-thin'} >Your Body Type</NavLink></li>
                        <li><NavLink to='/clothes' className={({ isActive }) => isActive? 'font-bold' : 'font-thin'} >Clothes</NavLink></li>
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
