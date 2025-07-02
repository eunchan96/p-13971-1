export interface PostDto {
    id: number;
    createDate: string;
    modifyDate: string;
    title: string;
}

export interface PostWithContentDto extends PostDto {
    content: string;
}

export interface PostCommentDto {
    id: number;
    createDate: string;
    modifyDate: string;
    content: string;
}