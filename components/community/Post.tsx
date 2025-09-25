
import React from 'react';
import type { Post as PostType } from '../../types';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
      <div className="flex items-start space-x-4">
        <img 
          src={post.author?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${post.author?.username || '?'}`} 
          alt={post.author?.username || 'User Avatar'}
          className="w-12 h-12 rounded-full object-cover bg-gray-200"
        />
        <div className="flex-1">
          <div className="flex items-baseline space-x-2">
            <p className="font-bold text-gray-900 dark:text-white">
              {post.author?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.created_at)}
            </p>
          </div>
          <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
