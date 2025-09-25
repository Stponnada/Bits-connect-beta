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
    // No need to set loading here, it's handled before the call in useEffect
    setError(null);
    
    try {
      // Step 1: Fetch all posts from the 'posts' table.
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, content, created_at, user_id')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      if (!postsData) {
        setPosts([]);
        return;
      }

      // Step 2: Extract the unique user IDs from the posts.
      const userIds = [...new Set(postsData.map(p => p.user_id).filter(Boolean))];

      if (userIds.length === 0) {
        // If there are no users, just set the posts with null authors.
        setPosts(postsData.map(p => ({...p, author: null})));
        return;
      }
      
      // Step 3: Fetch all the profiles that match the user IDs.
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;

      // Step 4: Create a Map for efficient profile look-up.
      const profilesMap = new Map(profilesData.map(p => [p.id, p]));

      // Step 5: "Join" the posts with their author profiles in the code.
      const combinedPosts = postsData.map(post => ({
        ...post,
        author: profilesMap.get(post.user_id) || null,
      }));

      setPosts(combinedPosts);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching posts and profiles:", err);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
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