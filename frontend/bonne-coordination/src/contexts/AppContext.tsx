import React, { createContext, useState, FC, ReactNode, Dispatch, SetStateAction} from 'react';

interface Props {
    children: ReactNode;
}

export interface AppState {
    isSignedIn: boolean,
    setIsSignedIn: Dispatch<SetStateAction<boolean>>,
    userName: string,
    setUserName: Dispatch<SetStateAction<string>>,
    doesHaveBodyType: boolean,
    setDoesHaveBodyType: Dispatch<SetStateAction<boolean>>,
    bodyType: string,
    setBodyType: Dispatch<SetStateAction<string>>,
}

export const AppContext = createContext<AppState | null>(null);
export const AppContextProvider: FC<Props> = ({ children}) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [doesHaveBodyType, setDoesHaveBodyType] = useState(false);
    const [bodyType, setBodyType] = useState('未診断');
    return (
        <AppContext.Provider value={{
            isSignedIn,
            setIsSignedIn,
            userName,
            setUserName,
            doesHaveBodyType,
            setDoesHaveBodyType,
            bodyType,
            setBodyType,
        }}>
            {children}
        </AppContext.Provider>
    );
};
