import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSuccess.jsx"
import { GroupView } from "./components/GroupView.jsx";
import {AlbumView }from "./pages/AlbumView";
import {Feed} from "./pages/Feed.jsx";
import {Profile} from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <Layout>
                <GroupView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/feed"
          element={
            <ProtectedRoute>
              <Layout>
                <Feed />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/albums/:albumId"
          element={
            <ProtectedRoute>
              <Layout>
                <AlbumView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;