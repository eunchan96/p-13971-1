"use client";

import { apiFetch } from "@/lib/backend/client";
import { PostWithContentDto } from "@/type/post";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = use(params);
    const id = parseInt(idStr);
    
    const [post, setPost] = useState<PostWithContentDto | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        apiFetch(`/api/v1/posts/${id}`).then(setPost);
    }, []);

    if(post == null) {
        return <div>로딩중...</div>;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const title = form.elements.namedItem("title") as HTMLInputElement;
        const content = form.elements.namedItem("content") as HTMLTextAreaElement;

        title.value = title.value.trim();

        if(title.value.length === 0) {
            alert("제목을 입력해주세요.");
            title.focus();
            return;
        }

        if(title.value.length < 2) {
            alert("제목은 2자 이상 입력해주세요.");
            title.focus();
            return;
        }

        content.value = content.value.trim();

        if(content.value.length === 0) {
            alert("내용을 입력해주세요.");
            content.focus();
            return;
        }

        if(content.value.length < 2) {
            alert("내용은 2자 이상 입력해주세요.");
            content.focus();
            return;
        }

        apiFetch(`/api/v1/posts/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: title.value,
                content: content.value,
            }),
        }).then((data) => {
            alert(data.msg);
            router.replace(`/posts/${id}`);
        });
    };

    return (
        <>
            <h1>{id}번 글 수정</h1>

            <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
                <input className="border rounded p-2" type="text" name="title" placeholder="제목" defaultValue={post.title} autoFocus />
                <textarea className="border rounded p-2" name="content" placeholder="내용" defaultValue={post.content} />
                <button className="border rounded p-2 cursor-pointer" type="submit">저장</button>
            </form>
        </>
    );
}