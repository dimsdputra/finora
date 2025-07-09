import { Navigate, Route, Routes } from "react-router";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import Home from "../home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/transaction" element={<Home />} />
      <Route path="/category" element={<Home />} />
      <Route path="/setting" element={<Home />} />
      <Route path="/error/*" element={<div>Page Not Found</div>} />
      {/* Add more routes as needed */}
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default AppRoutes;
