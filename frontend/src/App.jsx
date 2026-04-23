import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-lock me-2"></i>
            Full Stack Auth System
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="btn btn-outline-light btn-sm ms-2"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={
            <div className="jumbotron bg-light p-5 rounded">
              <h1 className="display-4">Full Stack Authentication System</h1>
              <p className="lead">
                This is a complete authentication system with JWT, Role-Based Access Control (RBAC), 
                and MongoDB database. Built with React, Node.js, Express, and MongoDB.
              </p>
              <hr className="my-4" />
              <div className="row mt-5">
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title"><i className="fas fa-user-plus text-primary"></i> Register</h5>
                      <p className="card-text">Create a new account with email and password. Choose between user or admin role.</p>
                      <Link to="/register" className="btn btn-primary">Go to Register</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title"><i className="fas fa-sign-in-alt text-success"></i> Login</h5>
                      <p className="card-text">Login to your account with your credentials. Use demo accounts for quick testing.</p>
                      <Link to="/login" className="btn btn-success">Go to Login</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title"><i className="fas fa-tachometer-alt text-info"></i> Dashboard</h5>
                      <p className="card-text">Access your personalized dashboard with role-based content after login.</p>
                      {isAuthenticated ? (
                        <Link to="/dashboard" className="btn btn-info">Go to Dashboard</Link>
                      ) : (
                        <button className="btn btn-secondary" disabled>Login Required</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <h3>Features Implemented</h3>
                <ul>
                  <li>JWT Authentication with token storage</li>
                  <li>Role-Based Access Control (Admin/User)</li>
                  <li>Protected routes with middleware</li>
                  <li>Password hashing with bcrypt</li>
                  <li>MongoDB database integration</li>
                  <li>Responsive Bootstrap UI</li>
                  <li>Skip login functionality (demo admin)</li>
                </ul>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="text-center mt-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
          } />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <div className="container">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Full Stack Authentication System | 
            Experiment 8 - JWT + RBAC
          </p>
          <p className="text-muted">
            Built with React, Node.js, Express, MongoDB
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;