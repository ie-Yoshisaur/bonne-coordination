import React, { createContext, useState, FC, ReactNode, Dispatch, SetStateAction} from 'react';

interface Props {
    children: ReactNode;
}

export interface AppState {
    isSignedIn: boolean,
    setIsSignedIn: Dispatch<SetStateAction<boolean>>,
    userName: string,
    setUserName: Dispatch<SetStateAction<string>>,
    doesHaveSkeletalType: boolean,
    setDoesHaveSkeletalType: Dispatch<SetStateAction<boolean>>,
    skeletalType: string,
    setSkeletalType: Dispatch<SetStateAction<string>>,
}

export const AppContext = createContext<AppState | null>(null);
export const AppContextProvider: FC<Props> = ({ children}) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [doesHaveSkeletalType, setDoesHaveSkeletalType] = useState(false);
    const [skeletalType, setSkeletalType] = useState('未診断');
    return (
        <AppContext.Provider value={{
            isSignedIn,
            setIsSignedIn,
            userName,
            setUserName,
            doesHaveSkeletalType,
            setDoesHaveSkeletalType,
            skeletalType,
            setSkeletalType,
        }}>
            {children}
        </AppContext.Provider>
    );
};
