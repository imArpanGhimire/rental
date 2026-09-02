import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";

import Browse from "./pages/listings/Browse.jsx";
import ListingDetail from "./pages/listings/ListingDetail.jsx";

import OwnerDashboard from "./pages/owner/Dashboard.jsx";
import MyListings from "./pages/owner/MyListings.jsx";
import CreateListing from "./pages/owner/CreateListing.jsx";

import RenterDashboard from "./pages/renter/Dashboard.jsx";
import SavedListings from "./pages/renter/SavedListings.jsx";

import ProfileSettings from "./pages/settings/ProfileSettings.jsx";

import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import Footer from "./components/footer.jsx";

import About from "./pages/static/About.jsx";
import HowItWorks from "./pages/static/HowItWorks.jsx";
import Help from "./pages/static/Help.jsx";
import Privacy from "./pages/static/Privacy.jsx";
import Terms from "./pages/static/Terms.jsx";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* PAGE CONTENT */}
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Browse />} />

            <Route path="/listings/:id" element={<ListingDetail />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/forgot-password" element={<ForgetPassword />} />

            {/* STATIC ROUTES */}
            <Route path="/about" element={<About />} />

            <Route path="/how-it-works" element={<HowItWorks />} />

            <Route path="/help" element={<Help />} />

            <Route path="/privacy" element={<Privacy />} />

            <Route path="/terms" element={<Terms />} />

            {/* OWNER ROUTES */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/listings"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <MyListings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/listings/new"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <CreateListing />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/settings"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />

            {/* RENTER ROUTES */}
            <Route
              path="/renter"
              element={
                <ProtectedRoute allowedRoles={["renter"]}>
                  <RenterDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/renter/saved"
              element={
                <ProtectedRoute allowedRoles={["renter"]}>
                  <SavedListings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/renter/settings"
              element={
                <ProtectedRoute allowedRoles={["renter"]}>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />

            <Route path="/forgot-password" element={<ForgetPassword />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
