import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import SignUpModal from '../components/modals/SignUpModal';
import SignInModal from '../components/modals/SignInModal';

const Home = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const navigateToSkeletalDiagnosisPage = () => {
        navigate('/page1');
    };
    const ComponentsToRenderIfNotSignedIn = () => {
        if (!appContext?.isSignedIn) {
            return (
                <>
                    <SignUpModal />
                    <SignInModal />
                </ >
            );
        }
        return (
            <>
                <button onClick={navigateToSkeletalDiagnosisPage}>骨格診断をする</button>
            </ >
        );
    };
            
    return (
        <>
            <h1> Bonne Coordination </h1>
            <ComponentsToRenderIfNotSignedIn />
        </>
    );
};

export default Home;
