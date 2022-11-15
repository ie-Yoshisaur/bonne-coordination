import React, {useState, useContext} from 'react';
import { AppContext } from '../contexts/AppContext';
import SignUpModal from '../components/modals/SignUpModal';

const Home = () => {
    const appContext = useContext(AppContext);
            
    return (
        <>
            <SignUpModal />
        </>
    );
};

export default Home;
