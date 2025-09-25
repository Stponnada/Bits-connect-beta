import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import type { Post, UserProfile } from '../../types';

interface CreatePostFormProps {
    onPostCreated: (post: Post) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || !user || !profile) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('posts')
      .insert({ content: content.trim(), user_id: user.id })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if(data) {
      setContent('');
      // FIX: Ensure the author object being passed is a complete, valid UserProfile.
      // The `profile` from useAuth is the complete, correct object to use here.
      // This prevents rendering errors if the profile was partial or null.
      const newPost: Post = {
          ...data,
          author: profile as UserProfile 
      };
      onPostCreated(newPost);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
          rows={3}
          placeholder={`What's on your mind, ${profile?.username || 'user'}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end mt-2">
          <Button type="submit" isLoading={loading} disabled={!content.trim()}>
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
