import React, { useContext, useState, type PropsWithChildren } from "react";
import Loading from "../components/ui/Loading";

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
};

export const LoadingContext = React.createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
      }}
    >
      <div className="relative">
        {children}
        {isLoading && (
          <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex justify-center items-center z-[9999]">
            <div className="flex flex-col items-center">
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                  height: "100vh",
                  width: "100vw",
                }}
              >
                <Loading />
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingContext.Provider>
  );
};

const useLoading = () => {
  const context = useContext(LoadingContext);

  return context;
};

export default useLoading;
