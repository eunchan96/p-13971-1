"use client";

import { apiFetch } from "@/lib/backend/client";
import type { PostCommentDto, PostWithContentDto } from "@/type/post";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

function usePost(id: number) {
  const [post, setPost] = useState<PostWithContentDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`)
      .then(setPost)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  }, []);

  const deletePost = (id: number, onSuccess: () => void) => {
    apiFetch(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then(onSuccess);
  };

  return { id, post, deletePost };
}

function usePostComments(postId: number) {
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${postId}/comments`)
      .then(setPostComments)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  }, []);

  const deleteComment = (commentId: number, onSuccess: (data: any) => void) => {
    apiFetch(`/api/v1/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    }).then((data) => {
      if (postComments == null) return;
      setPostComments(postComments.filter((comment) => comment.id !== commentId));

      onSuccess(data);
    });
  }

  const writeComment = (content: string, onSuccess: (data: any) => void) => {
    apiFetch(`/api/v1/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }).then((data) => {
      if (postComments == null) return;
      setPostComments([...postComments, data.data]);

      onSuccess(data);
    });
  }

  return { postId, postComments, deleteComment, writeComment };
}

function PostInfo({ postState }: { postState: ReturnType<typeof usePost> }) {
  const router = useRouter();
  const { post, deletePost: _deletePost } = postState;

  if (post == null) {
    return <div>로딩중...</div>;
  }

  const deletePost = () => {
    if (!confirm(`${post.id}번 글을 정말 삭제하시겠습니까?`)) return;

    _deletePost(post.id, () => router.replace("/posts"));
  }

  return (
    <>
      <div>번호 : {post.id}</div>
      <div>제목 : {post.title}</div>
      <div style={{ whiteSpace: "pre-line" }}>내용 : {post.content}</div>

      <div className="flex gap-2">
        <button className="border rounded p-2 cursor-pointer"
          onClick={deletePost}>삭제</button>
        <Link className="border rounded p-2" href={`/posts/${post.id}/edit`}>수정</Link>
      </div>
    </>
  );
}

function PostCommentWrite({ postCommentsState }: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { writeComment } = postCommentsState;

  const handleCommentWriteFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const content = form.elements.namedItem("content") as HTMLTextAreaElement;
    content.value = content.value.trim();

    if (content.value.length === 0) {
      alert("댓글 내용을 입력해주세요.");
      content.focus();
      return;
    }

    if (content.value.length < 2) {
      alert("댓글 내용을 2자 이상 입력해주세요.");
      content.focus();
      return;
    }

    writeComment(content.value, (data) => {
      alert(data.msg);
      content.value = "";
    });
  };

  return (
    <form className="flex flex-col gap-2 p-2" onSubmit={handleCommentWriteFormSubmit}>
      <textarea className="border rounded p-2" name="content" placeholder="댓글 내용" maxLength={5000} rows={5} />
      <button className="border rounded p-2 cursor-pointer" type="submit">작성</button>
    </form>
  );
}

function PostCommentList({ postCommentsState }: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { postComments } = postCommentsState;

  return (
    <>
      <h2>댓글 목록</h2>
      {postComments == null && <div>댓글 로딩중...</div>}
      {postComments != null && postComments.length === 0 && <div>댓글이 없습니다.</div>}
      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            <PostCommentListItem key={comment.id} comment={comment} postCommentsState={postCommentsState} />
          ))}
        </ul>
      )}
    </>
  );
}

function PostCommentListItem({ comment, postCommentsState }: {
  comment: PostCommentDto;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { deleteComment: _deleteComment } = postCommentsState;

  const deleteComment = (commentId: number) => {
    if (!confirm(`${commentId}번 댓글을 정말 삭제하시겠습니까?`)) return;

    _deleteComment(commentId, (data) => {
      alert(data.msg);
    });
  }

  return (
    <li>
      {comment.id} : {comment.content}
      <button className="border rounded p-2 cursor-pointer"
        onClick={() => deleteComment(comment.id)}>삭제</button>
    </li>
  );
}

function PostCommentWriteAndList({ postCommentsState }: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { postComments } = postCommentsState;

  if (postComments == null) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <PostCommentWrite postCommentsState={postCommentsState} />
      <PostCommentList postCommentsState={postCommentsState} />
    </>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = parseInt(idStr);

  const postState = usePost(id);
  const postCommentsState = usePostComments(id);

  return (
    <>
      <h1>글 상세페이지</h1>

      <PostInfo postState={postState} />

      <PostCommentWriteAndList postCommentsState={postCommentsState} />
    </>
  );
}