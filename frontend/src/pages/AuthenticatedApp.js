import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './subpages/Dashboard';
import Menu from '../components/Menu';
import Accounts from './subpages/Accounts';
import Budget from './subpages/Budget';
import Categories from './subpages/Categories';
import Report from './subpages/Report';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';  
import axiosInstance from '../api/axiosInstance';
import Transactions from './subpages/Transactions';
function AuthenticatedApp() {
  const refreshTokenInterval = 1 * 60 * 1000; // 2 minutes

    const refreshAuthToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.warn('No refresh token available');
            return;
        }

        try {
            const response = await axiosInstance.post('/api/accounts/refresh/', {
                refresh: refreshToken,
            });

            if (response.status === 200) {
                const { access } = response.data;
                localStorage.setItem('accessToken', access);
                console.log('Token refreshed successfully');
            }
        } catch (error) {
            console.error('Failed to refresh token:', error.response?.data || error.message);
            // Optionally log out the user if refreshing the token fails
            localStorage.clear();
            window.location.href = '/login?logout=true'; // Redirect to login
        }
    };

    useEffect(() => {
        // Start the refresh process on app load
        const intervalId = setInterval(refreshAuthToken, refreshTokenInterval);

        // Cleanup the interval on unmount
        return () => clearInterval(intervalId);
    }, [refreshTokenInterval]);

  // Simulate authentication (replace with actual auth logic)

  const isAuthenticated = localStorage.getItem('accessToken');
  const location = useLocation();

  let redirectURL = "/login?logout=true&redirect=" + location.pathname
  
  if (!isAuthenticated) {
    return <Navigate to={redirectURL} />;
  }

  return (
    <div className='main-app-wrap'>
      {/* Menu */}
      <div className='main-app-menu native-card-holder'>
        <Menu />
      </div>

      {/* Second-level routes */}
      <div className='main-app-wrap-board'>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="budget" element={<Budget />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="report" element={<Report />} />
          <Route path="/" element={<Navigate to="dashboard" />} />
          {/* <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="posts" element={<Posts />} />
          <Route path="*" element={<h1>Page Not Found</h1>} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default AuthenticatedApp;
