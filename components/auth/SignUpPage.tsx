
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
        // Create a profile entry for the new user.
        // This is a common pattern to separate public profiles from private auth data.
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            username: username,
        });

        if(profileError) {
             setError(`Sign up successful, but failed to create profile: ${profileError.message}`);
        } else {
             setSuccess("Success! Please check your email for a confirmation link to activate your account.");
        }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create your Account
        </h2>
        {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-3 rounded mb-4 text-sm">{error}</p>}
        {success && <p className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 p-3 rounded mb-4 text-sm">{success}</p>}
        
        <form onSubmit={handleSignUp} className="space-y-6">
          <Input 
            id="username"
            label="Username"
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            label="Password (min. 6 characters)"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <Button type="submit" className="w-full" isLoading={loading} disabled={!!success}>
              Sign Up
            </Button>
          </div>
        </form>
         <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
