import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { Link } from 'react-router-dom';
import SignInWithJwt from './functions/async/SignInWithJwt';
import Main from './Main';

export default function App() {
    const appContext = useContext(AppContext);
    useEffect(() => {
        SignInWithJwt(appContext);
    }, []);
    return (
        <>
            <div>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/page1'>page1</Link></li>
                    <li><Link to='/page2'>page2</Link></li>
                </ul>
                <hr />
                <Main />
            </div>
        </>
    );
}
