"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [post, setPost] = useState<{ id: number; title: string, content: string } | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/posts/1")
      .then((res) => res.json())
      .then(setPost);
  }, []);

  return (
    <>
      <h1>글 상세페이지</h1>
      {post == null && <div>로딩중...</div>}
      {post != null && (
        <>
          <div>번호 : {post.id}</div>
          <div>제목 : {post.title}</div>
          <div style={{ whiteSpace: "pre-line" }}>내용 : {post.content}</div>
        </>
      )}
    </>
  );
}
