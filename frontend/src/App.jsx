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
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Browse />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
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
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
