import React, { createContext, useContext, useState } from 'react';

const UiContext = createContext();

export const InterfaceProvider = ({ children }) => {
  const [sideBar, setSidebar] = useState(false);

  return (
    <UiContext.Provider value={{ sideBar, setSidebar }}>
      {children}
    </UiContext.Provider>
  );
};

export const useInterface = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error("useInterface must be used within an InterfaceProvider");
  }
  return context;
};
