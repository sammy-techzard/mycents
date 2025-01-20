import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Import Axios instance
import logoImage from '../logo/logo512.png';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    // Check URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        
        // Clear localStorage if logout=true
        if (urlParams.get('logout') === 'true') {
            localStorage.clear();
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/api/accounts/login/', formData);
        
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('accessToken', data.tokens.access);
                localStorage.setItem('refreshToken', data.tokens.refresh);
                localStorage.setItem('username', data.username); // Store the username
                
                // Check if there's a redirect URL in the query params
                const urlParams = new URLSearchParams(location.search);
                const redirectUrl = urlParams.get('redirect') || '/app'; // Default to '/app' if no redirect URL

                // Redirect the user after successful login
                window.location.href = redirectUrl
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const redirectToSignup = () => {
        navigate('/signup'); // Navigate to the signup page
    };

    return (
        <div className="native-card-holder signup-div">
            <div className="native-card signupformnative">
                <div className="signup-form">
                    <div className="signup-form-logo">
                        <img src={logoImage} alt="myCents" />
                    </div>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="native-input-div">
                            <label>Username</label>
                            <div className="native-input-tag">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="native-input-div">
                            <label>Password</label>
                            <div className="native-input-tag">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="native-submit-div">
                            <button
                                className="native-submit-div-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                        <div className="native-submit-div">
                            <span onClick={redirectToSignup} style={{ cursor: 'pointer', color: 'blue' }}>
                                Signup
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
