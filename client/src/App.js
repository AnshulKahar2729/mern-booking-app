import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";

const App = () => {
  return (
    <React.StrictMode>
      <UserContextProvider>
        <Routes>
          <Route path="/" e c65ylement={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account/:subpage?" element={<AccountPage />} />
            <Route path="/account/:subpage/:action" element={<AccountPage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </React.StrictMode>
  );
};

export default App;
