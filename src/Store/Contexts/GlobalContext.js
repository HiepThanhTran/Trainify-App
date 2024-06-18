import { createContext, useContext, useState } from 'react';

export const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
   const [currentSemester, setCurrentSemester] = useState(null);

   const globalValue = {
      currentSemester,
      setCurrentSemester,
   };

   return <GlobalContext.Provider value={globalValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};
