import React, { createContext, useState, FC, ReactNode, Dispatch, SetStateAction} from 'react';
import ClotheInfo from '../type/ClotheInfo';

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
    coordination: Array<ClotheInfo>,
    setCoordination: Dispatch<SetStateAction<Array<ClotheInfo>>>,
    likedList: Array<ClotheInfo>,
    setLikedList: Dispatch<SetStateAction<Array<ClotheInfo>>>,
    dislikedList: Array<ClotheInfo>,
    setDislikedList: Dispatch<SetStateAction<Array<ClotheInfo>>>,
}

export const AppContext = createContext<AppState>({} as AppState);
export const AppContextProvider: FC<Props> = ({ children}) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [doesHaveBodyType, setDoesHaveBodyType] = useState(false);
    const [bodyType, setBodyType] = useState('未診断');
    const [coordination, setCoordination] = useState([] as Array<ClotheInfo>);
    const [likedList, setLikedList] = useState([] as Array<ClotheInfo>);
    const [dislikedList, setDislikedList] = useState([] as Array<ClotheInfo>);
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
            coordination,
            setCoordination,
            likedList,
            setLikedList,
            dislikedList,
            setDislikedList,
        }}>
            {children}
        </AppContext.Provider>
    );
};
