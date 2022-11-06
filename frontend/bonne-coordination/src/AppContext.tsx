import { createContext, useState, FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  userName: String,
  setUserName: Function,
  themeColor: String,
  setThemeColor: Function,
}

export const AppContext = createContext<State | null>(null);
export const AppContextProvider: FC<Props> = ({ children }) => {
  const [userName, setUserName] = useState('Yoshisaur');
  const [themeColor, setThemeColor] = useState('light');

  return (
    <AppContext.Provider value={{
      userName,
      setUserName,
      themeColor,
      setThemeColor,
    }}>
      {children}
    </AppContext.Provider>
  );
}
