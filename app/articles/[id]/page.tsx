import { pool } from "@/lib/db"
import { notFound } from "next/navigation"
import type { ArticleDetail } from "@/types/article"
import Link from "next/link"
import { DeleteArticleButton } from "./DeleteArticleButton"
import { getCurrentUser } from "@/lib/auth/user"

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const articleId = Number(id)

  if (!Number.isInteger(articleId) || articleId <= 0) {
    notFound()
  }

  const result = await pool.query(
    `
      SELECT
        articles.id,
        articles.user_id AS "userId",
        articles.title,
        articles.content,
        articles.job_type AS "jobType",
        articles.industry,
        articles.created_at AS "createdAt",
        articles.updated_at AS "updatedAt",
        users.name AS "authorName",
        users.school_name AS "schoolName",
        users.graduation_year AS "graduationYear"
      FROM articles
      JOIN users
        ON articles.user_id = users.id
      WHERE articles.id = $1;
    `,
    [articleId]
  )

  const article: ArticleDetail | undefined = result.rows[0]

  if (!article) {
    notFound()
  }

  const currentUser = await getCurrentUser();

  const isOwner: boolean = currentUser?.id === article.userId;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/articles"
          className="text-sm text-gray-500 hover:underline"
        >
          ← 記事一覧へ
        </Link>

        {
          isOwner &&
          <div className="flex gap-2">
            <Link
              href={`/articles/${article.id}/edit`}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
            >
              編集する
            </Link>

            <DeleteArticleButton articleId={article.id} />
          </div>
        }
      </div>

      <article>
        <h1 className="text-3xl font-bold leading-tight">
          {article.title}
        </h1>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            {article.authorName} ・ {article.schoolName} ・{" "}
            {article.graduationYear}年卒
          </p>

          <p className="mt-1">
            {article.createdAt.toLocaleDateString("ja-JP")}
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            {article.jobType}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            {article.industry}
          </span>
        </div>

        <hr className="my-8" />

        <div className="whitespace-pre-wrap leading-8">
          {article.content}
        </div>
      </article>
    </main>
  )
}
