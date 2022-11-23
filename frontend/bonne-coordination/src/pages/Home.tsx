import React, {useState, useContext} from 'react';
import { AppContext } from '../contexts/AppContext';
import SignUpModal from '../components/modals/SignUpModal';
import SignInModal from '../components/modals/SignInModal';

const Home = () => {
    const appContext = useContext(AppContext);
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
                <button>骨格診断をする</button>
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
