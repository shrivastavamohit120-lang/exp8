import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch user data from backend
        fetchUserData(token);
        
        // If admin, fetch all users
        if (parsedUser.role === 'admin') {
            fetchAllUsers(token);
        }
    }, [navigate]);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };

    const fetchAllUsers = async (token) => {
        try {
            const response = await axios.get('/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch all users:', err);
            if (err.response?.status === 403) {
                setError('You do not have permission to view all users.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">Auth System Dashboard</span>
                    <div className="navbar-nav ms-auto">
                        <span className="nav-item nav-link">
                            Welcome, <strong>{user?.name}</strong>
                            <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-success'} ms-2`}>
                                {user?.role}
                            </span>
                        </span>
                        <button className="btn btn-outline-light btn-sm ms-3" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="mb-0">
                                <i className="fas fa-tachometer-alt me-2"></i>
                                Dashboard Overview
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card bg-primary text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Your Role</h5>
                                            <p className="card-text display-6">{user?.role.toUpperCase()}</p>
                                            <p className="card-text">
                                                {user?.role === 'admin' 
                                                    ? 'You have full administrative privileges' 
                                                    : 'You have standard user access'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bg-success text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Email</h5>
                                            <p className="card-text">{user?.email}</p>
                                            <p className="card-text">Verified Account</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bg-info text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Account Created</h5>
                                            <p className="card-text">
                                                {new Date(user?.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="card-text">Active User</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role-Based Content */}
                    {user?.role === 'admin' ? (
                        <div className="card mb-4">
                            <div className="card-header bg-danger text-white">
                                <h4 className="mb-0">
                                    <i className="fas fa-users-cog me-2"></i>
                                    Admin Panel - All Users
                                </h4>
                            </div>
                            <div className="card-body">
                                {error && <div className="alert alert-warning">{error}</div>}
                                <p className="card-text">
                                    As an administrator, you can view all registered users in the system.
                                </p>
                                
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u, index) => (
                                                <tr key={u._id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {u.name}
                                                        {u._id === user._id && (
                                                            <span className="badge bg-primary ms-2">You</span>
                                                        )}
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-muted mt-3">
                                    Total Users: <strong>{users.length}</strong> | 
                                    Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong> | 
                                    Regular Users: <strong>{users.filter(u => u.role === 'user').length}</strong>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="card mb-4">
                            <div className="card-header bg-success text-white">
                                <h4 className="mb-0">
                                    <i className="fas fa-user me-2"></i>
                                    User Profile
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5>Your Information</h5>
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <th>Name:</th>
                                                    <td>{user?.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td>{user?.email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Role:</th>
                                                    <td>
                                                        <span className="badge bg-success">{user?.role}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Member Since:</th>
                                                    <td>{new Date(user?.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h6 className="card-title">Access Information</h6>
                                                <p className="card-text">
                                                    As a regular user, you can only view your own profile.
                                                    To access all users, you need admin privileges.
                                                </p>
                                                <div className="alert alert-info">
                                                    <small>
                                                        <i className="fas fa-info-circle me-2"></i>
                                                        Contact an administrator to upgrade your role.
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Protected Route Test */}
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Protected Route Test</h4>
                        </div>
                        <div className="card-body">
                            <p>
                                This dashboard is protected by JWT authentication. Your token is stored in localStorage.
                                If you try to access this page without a valid token, you'll be redirected to login.
                            </p>
                            <div className="alert alert-warning">
                                <strong>Token:</strong> 
                                <code className="ms-2">
                                    {localStorage.getItem('token')?.substring(0, 30)}...
                                </code>
                                <button 
                                    className="btn btn-sm btn-outline-secondary ms-3"
                                    onClick={() => navigator.clipboard.writeText(localStorage.getItem('token') || '')}
                                >
                                    Copy
                                </button>
                            </div>
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate('/')}
                                >
                                    Go to Home
                                </button>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/login')}
                                >
                                    Go to Login
                                </button>
                                <button 
                                    className="btn btn-info"
                                    onClick={() => navigate('/register')}
                                >
                                    Go to Register
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;