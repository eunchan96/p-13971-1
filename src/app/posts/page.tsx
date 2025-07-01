"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    setPosts([
      { id: 1, title: "명언 1" },
      { id: 2, title: "명언 2" },
      { id: 3, title: "명언 3" },
    ]);
  }, []);

  return (
    <>
      <h1>글 목록</h1>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
