import { createContext, useContext, useState } from 'react';

export const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
   const [semester, setSemester] = useState(null);

   const [loading, setLoading] = useState(false);
   const [isRendered, setIsRedered] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   const globalValue = {
      semester,
      setSemester,
      loading,
      setLoading,
      isRendered,
      setIsRedered,
      refreshing,
      setRefreshing,
   };

   return <GlobalContext.Provider value={globalValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};
