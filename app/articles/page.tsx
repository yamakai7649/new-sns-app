import { pool } from "@/lib/db"
import type { ArticleListItem } from "@/types/article"
import Link from "next/link"

export default async function ArticlesPage() {
  const result = await pool.query(`
    SELECT
      articles.id,
      articles.title,
      articles.job_type AS "jobType",
      articles.industry,
      articles.created_at AS "createdAt",
      users.name AS "authorName",
      users.school_name AS "schoolName",
      users.graduation_year AS "graduationYear"
    FROM articles
    JOIN users
      ON articles.user_id = users.id
    ORDER BY articles.created_at DESC;
  `)

  const articles: ArticleListItem[] = result.rows

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">就活記事</h1>

        <Link
          href="/articles/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          記事を書く
        </Link>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-lg border p-5"
          >
            <Link href={`/articles/${article.id}`}>
              <h2 className="text-lg font-semibold hover:underline">
                {article.title}
              </h2>
            </Link>

            <div className="mt-3 text-sm text-gray-600">
              <p>
                {article.authorName} ・ {article.schoolName} ・{" "}
                {article.graduationYear}年卒
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {article.jobType}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {article.industry}
              </span>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {article.createdAt.toLocaleDateString("ja-JP")}
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}
