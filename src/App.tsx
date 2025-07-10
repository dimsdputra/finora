import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingProvider } from "./hooks/useLoading";
import { Toaster } from "./components/ui/Sonner";
import AuthInit from "./pages/auth/AuthInit";
import AppRoutes from "./pages/Routes/AppRoutes";
import { useThemeStore } from "./store/themeStore";
import "tippy.js/dist/tippy.css";

const { BASE_URL } = import.meta.env;
const queryClient = new QueryClient();

const App = () => {
  const { theme } = useThemeStore();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className={theme}>
            <section className="bg-base-200 h-screen w-screen overflow-x-hidden overflow-y-auto custom-scrollbar">
              <LoadingProvider>
                <AuthInit>
                  <Toaster />
                  <AppRoutes />
                </AuthInit>
              </LoadingProvider>
            </section>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense>
  );
};

export default App;
