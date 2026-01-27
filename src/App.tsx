
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import System from "./pages/System";
import Users from "./pages/Users";
import ExecutionRuns from "./pages/ExecutionRuns";
import AssetFactory from "./pages/AssetFactory";
import Notifications from "./pages/Notifications";
import Content from "./pages/Content";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
          path="/"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/system"
          element={<ProtectedRoute><System /></ProtectedRoute>}
        />
        <Route
          path="/users"
          element={<ProtectedRoute><Users /></ProtectedRoute>}
        />
        <Route
          path="/execution-runs"
          element={<ProtectedRoute><ExecutionRuns /></ProtectedRoute>}
        />
        <Route
          path="/asset-factory"
          element={<ProtectedRoute><AssetFactory /></ProtectedRoute>}
        />
        <Route
          path="/notifications"
          element={<ProtectedRoute><Notifications /></ProtectedRoute>}
        />
        <Route
          path="/content"
          element={<ProtectedRoute><Content /></ProtectedRoute>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
