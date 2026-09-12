import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home.jsx";
import ForOwners from "./pages/ForOwners.jsx";

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

import { useAuth } from "./features/auth/AuthContext.jsx";

function HomeRoute() {
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-ivory">
        <div className="flex items-center gap-2 text-sm text-ink/45">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brass" />
          Loading Rentora...
        </div>
      </div>
    );
  }

  if (isAuthenticated && role === "owner") {
    return <ForOwners />;
  }

  return <Home />;
}

function App() {
  const location = useLocation();

  const hideFooter =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* ROLE-AWARE LANDING PAGE */}
            <Route path="/" element={<HomeRoute />} />

            {/* PUBLIC LISTING ROUTES */}
            <Route path="/browse" element={<Browse />} />

            <Route path="/listings/:id" element={<ListingDetail />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/forgot-password" element={<ForgetPassword />} />

            {/* STATIC */}
            <Route path="/about" element={<About />} />

            <Route path="/how-it-works" element={<HowItWorks />} />

            <Route path="/help" element={<Help />} />

            <Route path="/privacy" element={<Privacy />} />

            <Route path="/terms" element={<Terms />} />

            {/* OWNER DASHBOARD */}
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

            {/* RENTER DASHBOARD */}
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
          </Routes>
        </AnimatePresence>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
