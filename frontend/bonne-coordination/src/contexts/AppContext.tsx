import React, { createContext, useState, FC, ReactNode, Dispatch, SetStateAction} from 'react';

interface Props {
    children: ReactNode;
}

export interface AppState {
    userName: string,
    setUserName: Dispatch<SetStateAction<string>>,
    skeletalType: string,
    setSkeletalType: Dispatch<SetStateAction<string>>,
    imageURL: string,
    setImageURL: Dispatch<SetStateAction<string>>,
}

export const AppContext = createContext<AppState | null>(null);
export const AppContextProvider: FC<Props> = ({ children}) => {
    const [userName, setUserName] = useState('');
    const [skeletalType, setSkeletalType] = useState('未分類');
    const [imageURL, setImageURL] = useState('');
    return (
        <AppContext.Provider value={{
            userName,
            setUserName,
            skeletalType,
            setSkeletalType,
            imageURL,
            setImageURL
        }}>
            {children}
        </AppContext.Provider>
    );
};
