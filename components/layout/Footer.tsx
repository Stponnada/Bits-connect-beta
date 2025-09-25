
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Bits Connect. All rights reserved.</p>
        <p className="text-sm">Re-engineered for performance and stability.</p>
      </div>
    </footer>
  );
};

export default Footer;
