import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Bits Connect
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/community" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Community
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
               <span className="font-semibold text-gray-700 dark:text-gray-200 hidden sm:block">
                Welcome, {profile?.username || user.email?.split('@')[0]}
              </span>
              <Button onClick={handleSignOut} variant="secondary">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;