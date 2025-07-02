"use client";

export default function Page() {
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

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                title: title.value,
                content: content.value,
            }),
        })
        .then((res) => res.json())
        .then((data) => alert(data.msg));
    };

    return (
        <>
            <h1>글쓰기</h1>

            <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
                <input className="border rounded p-2" type="text" name="title" placeholder="제목" />
                <textarea className="border rounded p-2" name="content" placeholder="내용" />
                <button className="border rounded p-2" type="submit">저장</button>
            </form>
        </>
    );
}