import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

type Context = {
  hide: () => void;
  show: (cb?: () => void) => void;
};

const backButtonProviderContext = createContext<Context>({
  hide: () => {},
  show: () => {},
});

export const BackButtonProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const navigate = useNavigate();

  function hide() {
    // TODO: Implement custom back button hide logic (e.g., in your own UI)
    console.log("Back button hide placeholder");
  }

  function goBack() {
    navigate(-1);
  }

  function show(cb?: () => void) {
    // TODO: Implement custom back button show logic
    // For now, just trigger navigation
    console.log("Back button show placeholder");

    if (cb) {
      cb();
    } else {
      goBack();
    }
  }

  return (
    <backButtonProviderContext.Provider
      value={{
        hide,
        show,
      }}
    >
      {children}
    </backButtonProviderContext.Provider>
  );
};

export const useBackButton = () => useContext(backButtonProviderContext);
