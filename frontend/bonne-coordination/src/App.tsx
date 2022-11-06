import React from 'react';
import { Link } from 'react-router-dom';
import Main from './Main';

export default function App() {
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
