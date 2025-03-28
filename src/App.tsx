import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { SchemesV1 } from "./pages/schemes/SchemesV1";
import { Property } from "./pages/Property";
import { PaymentDetails } from "./pages/PaymentDetails";
import { Users } from "./pages/Users";
import { Settings } from "./pages/Settings";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from './contexts/LanguageContext';

import CreateNewProperty from "./pages/NewProperty";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              {/* <Route element={<PrivateRoute />}> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/schemes-1" element={<SchemesV1 />} />

                <Route path="/yojna/:yojnaId" element={<Property />} />
                <Route path="/AddProperty" element={<CreateNewProperty />} />
                <Route path="/users" element={<Users />} />
                <Route path="/payment-details" element={<PaymentDetails />} />
                <Route path="/settings" element={<Settings />} />
              {/* </Route> */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}


