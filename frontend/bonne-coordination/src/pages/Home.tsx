import React, {useState, useContext} from 'react';
import { AppContext } from '../contexts/AppContext';
import SignUpModal from '../components/modals/SignUpModal';
import SignInModal from '../components/modals/SignInModal';

const Home = () => {
    const appContext = useContext(AppContext);
            
    return (
        <>
            <SignUpModal />
            <SignInModal />
        </>
    );
};

export default Home;
