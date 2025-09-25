
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/community');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login to Bits Connect
        </h2>
        {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-3 rounded mb-4 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            id="email"
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            id="password"
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <Button type="submit" className="w-full" isLoading={loading}>
              Sign In
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Not a member?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
