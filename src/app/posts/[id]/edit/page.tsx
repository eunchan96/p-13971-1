"use client";

import { apiFetch } from "@/lib/backend/client";
import { PostWithContentDto } from "@/type/post";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<PostWithContentDto | null>(null);

    useEffect(() => {
        apiFetch(`/api/v1/posts/${id}`).then(setPost);
    }, []);

    if(post == null) {
        return <div>로딩중...</div>;
    }

    return (
        <>
            <h1>{id}번 글 수정</h1>

            <form className="flex flex-col gap-2 p-2">
                <input className="border rounded p-2" type="text" name="title" placeholder="제목" defaultValue={post.title} autoFocus />
                <textarea className="border rounded p-2" name="content" placeholder="내용" defaultValue={post.content} />
                <button className="border rounded p-2 cursor-pointer" type="submit">저장</button>
            </form>
        </>
    );
}