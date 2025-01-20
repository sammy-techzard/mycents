import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AuthenticatedApp from './pages/AuthenticatedApp';
import NotFound from './pages/NotFound';
import './css/animation.css';
import './css/main.css';
import './css/smallscreen.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './pages/Logout';

function App() {

  



  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if a token is stored locally
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token); // Convert token existence to a boolean
  }, []);
  if (isAuthenticated) {
    console.log("authenticated");
    console.log(isAuthenticated);
  }
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to="/app" />}
        />
        {/* Public routes */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/app" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/app" />}
        />

        {/* Authenticated app */}
        <Route
          path="/app/*"
          element={isAuthenticated ? <AuthenticatedApp /> : <Navigate to="/login" />}
        />

        {/* Logout maker */}
        <Route
          path="/logout"
          element={ <Logout /> }
        />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

