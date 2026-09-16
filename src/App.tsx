import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import BrowseArtisans from "./pages/customer/BrowseArtisans";
import CreateServiceRequest from "./pages/customer/CreateServiceRequest";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerOrderDetails from "./pages/customer/CustomerOrderDetails";
import MyRequests from "./pages/customer/MyRequests";
import ServiceRequestDetails from "./pages/customer/ServiceRequestDetails";

import ArtisanDashboard from "./pages/artisan/ArtisanDashboard";
import ArtisanProfile from "./pages/artisan/ArtisanProfile";
import ArtisanRequests from "./pages/artisan/ArtisanRequests";
import ArtisanOrders from "./pages/artisan/ArtisanOrders";
import ArtisanOrderDetails from "./pages/artisan/ArtisanOrderDetails";

function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Customer Routes */}

      <Route
        path="/customer"
        element={
          <ProtectedRoute role="Customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute role="Customer">
            <CustomerProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/artisans"
        element={
          <ProtectedRoute role="Customer">
            <BrowseArtisans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/request"
        element={
          <ProtectedRoute role="Customer">
            <CreateServiceRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/requests"
        element={
          <ProtectedRoute role="Customer">
            <MyRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/requests/:requestId"
        element={
          <ProtectedRoute role="Customer">
            <ServiceRequestDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute role="Customer">
            <CustomerOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/orders/:orderId"
        element={
          <ProtectedRoute role="Customer">
            <CustomerOrderDetails />
          </ProtectedRoute>
        }
      />

      {/* Artisan Routes */}

      <Route
        path="/artisan"
        element={
          <ProtectedRoute role="Artisan">
            <ArtisanDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/artisan/profile"
        element={
          <ProtectedRoute role="Artisan">
            <ArtisanProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/artisan/requests"
        element={
          <ProtectedRoute role="Artisan">
            <ArtisanRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/artisan/orders"
        element={
          <ProtectedRoute role="Artisan">
            <ArtisanOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/artisan/orders/:orderId"
        element={
          <ProtectedRoute role="Artisan">
            <ArtisanOrderDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;