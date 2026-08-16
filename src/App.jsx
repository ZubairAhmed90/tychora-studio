import React, { useState } from 'react';
import Home from './components/Home';
import Editor from './components/Editor';
import { deletePost, duplicatePost, loadPosts } from './lib/storage';

export default function App() {
  const [posts, setPosts] = useState(() => loadPosts());
  const [current, setCurrent] = useState(null);

  if (current) {
    return (
      <Editor
        design={current}
        onBack={() => {
          setPosts(loadPosts());
          setCurrent(null);
        }}
        onSaved={setPosts}
      />
    );
  }

  return (
    <Home
      posts={posts}
      onNew={setCurrent}
      onOpen={setCurrent}
      onDelete={(id) => setPosts(deletePost(id))}
      onDuplicate={(post) => setPosts(duplicatePost(post))}
    />
  );
}
