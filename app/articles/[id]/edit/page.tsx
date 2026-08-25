import { pool } from "@/lib/db"
import { notFound } from "next/navigation"
import type { ArticleDetail } from "@/types/article"
import { updateArticle } from "@/lib/actions/article"
import { JOB_TYPES, INDUSTRIES } from "@/lib/constants/article"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const articleId = Number(id);
    
    if (!Number.isInteger(articleId) || articleId <= 0) {
        notFound();
    }
    
    const result = await pool.query(
        `
          SELECT
            articles.id,
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
    );

    const article: ArticleDetail | undefined = result.rows[0];

    if (!article) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <h1 className="mb-8 text-2xl font-bold">就活記事を編集する</h1>

            <form className="space-y-6" action={updateArticle.bind(null, article.id)}>
                <div>
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium"
                    >
                        タイトル
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        defaultValue={article.title}
                        className="w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="content"
                        className="mb-2 block text-sm font-medium"
                    >
                        本文
                    </label>

                    <textarea
                        id="content"
                        name="content"
                        rows={12}
                        defaultValue={article.content}
                        className="w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="jobType"
                        className="mb-2 block text-sm font-medium"
                    >
                        職種
                    </label>

                    <select
                        id="jobType"
                        name="jobType"
                        className="w-full rounded-md border px-3 py-2"
                        required
                        defaultValue={article.jobType}
                    >
                        <option value="" disabled>
                            職種を選択してください
                        </option>
                        {JOB_TYPES.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="industry"
                        className="mb-2 block text-sm font-medium"
                    >
                        業界
                    </label>

                    <select
                        id="industry"
                        name="industry"
                        className="w-full rounded-md border px-3 py-2"
                        required
                        defaultValue={article.industry}
                    >
                        <option value="" disabled>
                            業界を選択してください
                        </option>
                        {INDUSTRIES.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-black px-4 py-3 text-white"
                >
                    編集する
                </button>
            </form>
        </main>
    );
};
