export interface PostDto {
    id: number;
    title: string;
}

export interface PostWithContentDto extends PostDto {
    content: string;
}