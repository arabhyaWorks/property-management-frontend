import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Payments } from "./pages/Payments";
import { SchemesV1 } from "./pages/schemes/SchemesV1";
import { Property } from "./pages/Property";
import { PaymentDetails } from "./pages/PaymentDetails";
import { Users } from "./pages/Users";
import { Settings } from "./pages/Settings";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

import CreateNewProperty from "./pages/NewProperty";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import PaymentForm from "./components/paymentForm";
import { PropertyDetail } from "./pages/PropertyDetail";
// import EditProperty from "./pages/EditProperty";
import EditProperty from "./pages/oldEditProperty";
import PaymentDashboard from "./pages/PaymentDashboard";
import PropertyHome from "./alottee/pages/PropertyHome";
import PropertyLogin from "./alottee/pages/propertyLogin";
import PropertyDetails from "./alottee/pages/PropertyDetails";
import ServiceCharges from "./alottee/pages/ServiceCharge";
import EMIPayment from "./alottee/pages/EMIPayment";
import Profile from "./alottee/pages/Profile";
import PaymentCounter from "./pages/PaymentCounter";
import PaymentCounterPropertyDetail from "./pages/PaymentCounterPropertyDetail";
import PaymentCounterEMIPayment from "./counter/PaymentCounterEmiPayment";
import PaymentCounterServiceCharges from "./counter/PaymentCounterServiceCharge";


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
              <Route path="/payment-dashboard" element={<PaymentDashboard />} />

              <Route path="/yojna/:yojnaId" element={<Property />} />
              <Route
                path="/property/:property_id"
                element={<PropertyDetail />}
              />
              <Route path="/payment/:order_id" element={<Payments />} />
              <Route
                path="/edit-property/:property_id"
                element={<EditProperty />}
              />
              <Route path="/AddProperty" element={<CreateNewProperty />} />
         
              <Route path="/users" element={<Users />} />
              <Route path="/payment-details" element={<PaymentDetails />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="/alottee" element={<PropertyHome />} />
              {/* <Route path="/alottee/login" element={<PropertyLogin />} /> */}
              <Route path="/alottee/property/details"element={<PropertyDetails />} />
              <Route path="/alottee/property/service-charges"element={<ServiceCharges />} />
              <Route path="/alottee/property/pay-emi" element={<EMIPayment />} />
              <Route path="/alottee/profile" element={<Profile />} />


              {/* Payment Counter */}
              <Route path="/payment-counter" element={<PaymentCounter />} />
              <Route path="/payment-counter/:property_id" element={<PaymentCounterPropertyDetail />} />
              <Route path="/payment-counter/:property_id" element={<PaymentCounterPropertyDetail />} />
              <Route path="/payment-counter/property/pay-emi" element={<PaymentCounterEMIPayment />} />
              <Route path="/payment-counter/property/service-charges" element={<PaymentCounterServiceCharges />} />



              {/* </Route> */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
