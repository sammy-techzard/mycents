import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Import Axios instance
import logoImage from '../logo/logo512.png';

const Signup = () => {
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await axiosInstance.post('/api/accounts/signup/', formData);
        
            if (response.status === 201) {
                const data = response.data;
                localStorage.setItem('accessToken', data.tokens.access);
                localStorage.setItem('refreshToken', data.tokens.refresh);
                localStorage.setItem('username', data.username); // Store the username
                navigate('/app/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
        
    };

    const redirectToLogin = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div className="native-card-holder signup-div">
            <div className="native-card signupformnative">
                <div className='signup-form'>
                    <div className='signup-form-logo'>
                        <img src={logoImage} alt="myCenys" />
                    </div>
                    <h2>Signup</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='native-input-div'>
                            <label>Username</label>
                            <div className='native-input-tag'>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className='native-input-div'>
                            <label>Password</label>
                            <div className='native-input-tag'>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className='native-input-div'>
                            <label>Email</label>
                            <div className='native-input-tag'>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className='native-submit-div'>
                            <button className='native-submit-div-button' type="submit" disabled={loading}>
                            {loading ? 'Signing up...' : 'Signup'}
                            </button>
                        </div>
                        <div className="native-submit-div">
                            <span onClick={redirectToLogin} style={{ cursor: 'pointer', color: 'blue' }}>
                                Login
                            </span>
                        </div>

                    </form>
                 </div>
            </div>
        </div>
    );
};

export default Signup;
