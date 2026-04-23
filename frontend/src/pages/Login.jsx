import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [skipLoading, setSkipLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // Store token and user data in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkipLogin = async () => {
        setSkipLoading(true);
        setError('');
        
        // Use demo admin credentials to skip login
        const demoCredentials = {
            email: 'admin@example.com',
            password: 'password123'
        };

        try {
            const response = await axios.post('/api/auth/login', demoCredentials);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            // If admin doesn't exist, try to create it automatically
            try {
                await axios.post('/api/auth/register', {
                    name: 'Demo Admin',
                    email: 'admin@example.com',
                    password: 'password123',
                    role: 'admin'
                });
                // Then login
                const loginResponse = await axios.post('/api/auth/login', demoCredentials);
                localStorage.setItem('token', loginResponse.data.token);
                localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
                navigate('/dashboard');
            } catch (registerErr) {
                setError('Failed to setup demo account. Please register manually.');
            }
        } finally {
            setSkipLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-center">Login to Your Account</h2>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>

                                <div className="text-center mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100"
                                        onClick={handleSkipLogin}
                                        disabled={skipLoading}
                                    >
                                        {skipLoading ? 'Setting up demo...' : 'Skip Login (Use Demo Admin)'}
                                    </button>
                                    <small className="text-muted">Creates a demo admin account automatically</small>
                                </div>
                            </form>

                            <div className="text-center mt-3">
                                <p>Don't have an account? <Link to="/register">Register here</Link></p>
                                <p>
                                    <Link to="/">Back to Home</Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">Demo Credentials</h5>
                            <p className="card-text">You can use these accounts for quick testing:</p>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card bg-light mb-2">
                                        <div className="card-body">
                                            <h6 className="card-subtitle mb-2 text-primary">Admin Account</h6>
                                            <p className="card-text mb-1"><strong>Email:</strong> admin@example.com</p>
                                            <p className="card-text"><strong>Password:</strong> password123</p>
                                            <p className="card-text small">Can view all users</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card bg-light mb-2">
                                        <div className="card-body">
                                            <h6 className="card-subtitle mb-2 text-success">User Account</h6>
                                            <p className="card-text mb-1"><strong>Email:</strong> user@example.com</p>
                                            <p className="card-text"><strong>Password:</strong> password123</p>
                                            <p className="card-text small">Can view own profile only</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted mt-2">Or click "Skip Login" to automatically create and login as admin.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;