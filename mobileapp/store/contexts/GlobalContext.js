import { createContext } from 'react';

export const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
    return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
};
