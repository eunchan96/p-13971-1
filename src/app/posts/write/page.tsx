"use client";

export default function Page() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const title = form.elements.namedItem("title") as HTMLInputElement;
        const content = form.elements.namedItem("content") as HTMLTextAreaElement;

        if (title.value.length === 0) {
            alert("제목을 입력해주세요.");
            title.focus();
            return;
        }

        if (content.value.length === 0) {
            alert("내용을 입력해주세요.");
            content.focus();
            return;
        }
    };

    return (
        <>
            <h1>글쓰기</h1>

            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <input className="border rounded p-2" type="text" name="title" placeholder="제목" />
                <textarea className="border rounded p-2" name="content" placeholder="내용" />
                <button className="border rounded p-2" type="submit">저장</button>
            </form>
        </>
    );
}