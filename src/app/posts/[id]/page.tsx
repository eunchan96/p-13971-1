"use client";

import { apiFetch } from "@/lib/backend/client";
import type { PostCommentDto, PostWithContentDto } from "@/type/post";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<PostWithContentDto | null>(null);
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(null);

  const deletePost = (id: number) => {
    apiFetch(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg);
      router.replace("/posts");
    });
  };

  const deleteComment = (commentId: number) => {
    apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg);

      if(postComments == null) return;
      setPostComments(postComments.filter((comment) => comment.id !== commentId));
    });
  }

  const handleCommentWriteFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const content = form.elements.namedItem("content") as HTMLTextAreaElement;
    content.value = content.value.trim();

    if(content.value.length === 0) {
      alert("댓글 내용을 입력해주세요.");
      content.focus();
      return;
    }

    apiFetch(`/api/v1/posts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({
        content: content.value,
      }),
    }).then((data) => {
      alert(data.msg);
      content.value = "";

      if(postComments == null) return;
      setPostComments([...postComments, data.data]);
    });
  };

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`).then(setPost);
    apiFetch(`/api/v1/posts/${id}/comments`).then(setPostComments);
  }, []);

  if (post == null) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <h1>글 상세페이지</h1>

      <div>번호 : {post.id}</div>
      <div>제목 : {post.title}</div>
      <div style={{ whiteSpace: "pre-line" }}>내용 : {post.content}</div>

      <div className="flex gap-2">
        <button className="border rounded p-2 cursor-pointer" 
          onClick={() => confirm(`${post.id}번 글을 정말 삭제하시겠습니까?`) && deletePost(post.id)}>삭제</button>
        <Link className="border rounded p-2" href={`/posts/${post.id}/edit`}>수정</Link>
      </div>

      <h2>댓글 작성</h2>
      <form className="flex flex-col gap-2 p-2" onSubmit={handleCommentWriteFormSubmit}>
        <textarea className="border rounded p-2" name="content" placeholder="댓글 내용" />
        <button className="border rounded p-2 cursor-pointer" type="submit">작성</button>
      </form>

      <h2>댓글 목록</h2>
      {postComments == null && <div>댓글 로딩중...</div>}
      {postComments != null && postComments.length === 0 && <div>댓글이 없습니다.</div>}
      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            <li key={comment.id}>
              {comment.id} : {comment.content}
              <button className="border rounded p-2 cursor-pointer" 
                onClick={() => confirm(`${comment.id}번 댓글을 정말 삭제하시겠습니까?`) && deleteComment(comment.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
