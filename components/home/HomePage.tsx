
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
        Welcome to <span className="text-blue-600 dark:text-blue-400">Bits Connect</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
        Your central hub for connecting with peers, discovering events, and staying engaged with the campus community.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/signup">
          <Button variant="primary" className="text-lg px-8 py-3">
            Get Started
          </Button>
        </Link>
        <Link to="/community">
          <Button variant="secondary" className="text-lg px-8 py-3">
            Explore Community
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
