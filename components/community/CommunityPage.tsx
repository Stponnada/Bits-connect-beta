import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import type { Post as PostType } from '../../types';
import Post from './Post';
import CreatePostForm from './CreatePostForm';
import Spinner from '../ui/Spinner';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // With the foreign key in place, we can use one efficient query to get posts
      // and their related author profiles.
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
          author:profiles ( id, username, avatar_url )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // FIX: The Supabase query may return the related author profile as an array.
      // We need to flatten this to a single object to match our `PostType` interface.
      const formattedPosts = data.map(post => {
        const authorProfile = Array.isArray(post.author) ? post.author[0] : post.author;
        return {
          ...post,
          author: authorProfile || null,
        };
      }) as PostType[];

      setPosts(formattedPosts);

    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost: PostType) => {
    // Add the new post to the top of the feed for an instant UI update.
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Community Feed</h1>
      <CreatePostForm onPostCreated={handlePostCreated} />
      
      <div className="mt-8 space-y-6">
        {loading ? (
           <div className="flex justify-center mt-8"><Spinner /></div>
        ) : error ? (
           <div className="text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-4 rounded-lg">Error: {error}</div>
        ) : posts.length > 0 ? (
          posts.map(post => <Post key={post.id} post={post} />)
        ) : (
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;