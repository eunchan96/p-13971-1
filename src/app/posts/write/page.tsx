"use client";

import { apiFetch } from "@/lib/backend/client";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const title = form.elements.namedItem("title") as HTMLInputElement;
        const content = form.elements.namedItem("content") as HTMLTextAreaElement;

        title.value = title.value.trim();

        if (title.value.length === 0) {
            alert("제목을 입력해주세요.");
            title.focus();
            return;
        }

        content.value = content.value.trim();

        if (content.value.length === 0) {
            alert("내용을 입력해주세요.");
            content.focus();
            return;
        }

        apiFetch(`/api/v1/posts`, {
            method: "POST",
            body: JSON.stringify({
                title: title.value,
                content: content.value,
            }),
        })
        .then((data) => {
            alert(data.msg);
            router.replace(`/posts/${data.data.id}`);
        });
    };

    return (
        <>
            <h1>글쓰기</h1>

            <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
                <input className="border rounded p-2" type="text" name="title" placeholder="제목" autoFocus />
                <textarea className="border rounded p-2" name="content" placeholder="내용" />
                <button className="border rounded p-2 cursor-pointer" type="submit">저장</button>
            </form>
        </>
    );
}