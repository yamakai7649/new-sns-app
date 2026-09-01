export type ArticleListItem = {
    id: number
    title: string
    jobType: string
    industry: string
    createdAt: Date
    authorName: string
    schoolName: string
    graduationYear: number
};

export type ArticleDetail = ArticleListItem & {
  userId: number
  content: string
  updatedAt: Date | null
}
