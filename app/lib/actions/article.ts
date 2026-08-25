"use server"

import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { JOB_TYPE_VALUES, INDUSTRY_VALUES } from "@/lib/constants/article"

export async function createArticle(formData: FormData) {
  const title = formData.get("title")
  const content = formData.get("content")
  const jobType = formData.get("jobType")
  const industry = formData.get("industry")

  // FormDataは string | File | null の可能性があるので確認
  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof jobType !== "string" ||
    typeof industry !== "string"
  ) {
    throw new Error("入力内容が不正です")
  }

  // 空文字チェック
  if (
    !title.trim() ||
    !content.trim() ||
    !jobType.trim() ||
    !industry.trim()
  ) {
    throw new Error("すべての項目を入力してください")
  }

  if (
    !JOB_TYPE_VALUES.includes(jobType as (typeof JOB_TYPE_VALUES)[number]) ||
    !INDUSTRY_VALUES.includes(industry as (typeof INDUSTRY_VALUES)[number])
  ) {
    throw new Error("職種または業界の値が不正です")
  }

  // 認証実装前なので一旦固定
  const userId = 1

  const result = await pool.query(
    `
      INSERT INTO articles (
        user_id,
        title,
        content,
        job_type,
        industry
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
    [
      userId,
      title.trim(),
      content.trim(),
      jobType,
      industry,
    ]
  )

  const articleId = result.rows[0].id

  revalidatePath("/articles")
  redirect(`/articles/${articleId}`)
}


export async function updateArticle(
  articleId: number,
  formData: FormData
) {
  const title = formData.get("title")
  const content = formData.get("content")
  const jobType = formData.get("jobType")
  const industry = formData.get("industry")

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof jobType !== "string" ||
    typeof industry !== "string"
  ) {
    throw new Error("入力内容が不正です")
  }

  if (
    !title.trim() ||
    !content.trim() ||
    !jobType.trim() ||
    !industry.trim()
  ) {
    throw new Error("すべての項目を入力してください")
  }

  if (
    !JOB_TYPE_VALUES.includes(jobType as (typeof JOB_TYPE_VALUES)[number]) ||
    !INDUSTRY_VALUES.includes(industry as (typeof INDUSTRY_VALUES)[number])
  ) {
    throw new Error("職種または業界の値が不正です")
  }

  const result = await pool.query(
    `
      UPDATE articles
      SET
        title = $1,
        content = $2,
        job_type = $3,
        industry = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING id;
    `,
    [
      title.trim(),
      content.trim(),
      jobType,
      industry,
      articleId,
    ]
  )

  if (result.rows.length === 0) {
    throw new Error("記事が見つかりません")
  }

  revalidatePath("/articles")
  revalidatePath(`/articles/${articleId}`)

  redirect(`/articles/${articleId}`)
}

export async function deleteArticle(articleId: number) {
  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw new Error("記事IDが不正です")
  }

  const result = await pool.query(
    `
      DELETE FROM articles
      WHERE id = $1
      RETURNING id;
    `,
    [articleId]
  )

  if (result.rows.length === 0) {
    throw new Error("記事が見つかりません")
  }

  revalidatePath("/articles")
  redirect("/articles")
}
