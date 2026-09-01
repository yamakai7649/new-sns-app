"use server"

import { pool } from "@/lib/db"
import { hashPassword } from "@/lib/auth/password"
import { redirect } from "next/navigation"
import { createSession, deleteSession } from "@/lib/auth/session"
import { verifyPassword } from "@/lib/auth/password"
import { SCHOOL_TYPE_VALUES } from "../constants/user"

export async function register(formData: FormData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  const schoolName = formData.get("schoolName")
  const schoolType = formData.get("schoolType")
  const faculty = formData.get("faculty")
  const graduationYear = formData.get("graduationYear")

  // ① 型チェック
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof schoolName !== "string" ||
    typeof schoolType !== "string" ||
    typeof faculty !== "string" ||
    typeof graduationYear !== "string"
  ) {
    throw new Error("入力内容が不正です")
  }

  // ② 空文字チェック
  if (
    !name.trim() ||
    !email.trim() ||
    !password ||
    !schoolName.trim() ||
    !schoolType ||
    !graduationYear
  ) {
    throw new Error("必須項目を入力してください")
  }

  if (password.length < 8) {
    throw new Error("パスワードは8文字以上で入力してください")
  }

  const year = Number(graduationYear)

  if (!Number.isInteger(year)) {
    throw new Error("卒業年度が不正です")
  }

  if (
      !SCHOOL_TYPE_VALUES.includes(schoolType as (typeof SCHOOL_TYPE_VALUES)[number])
  ) {
    throw new Error("学校区分の値が不正です");
  }

  // ③ email正規化
  const normalizedEmail = email.trim().toLowerCase()

  // ④ passwordをArgon2idでhash
  const passwordHash = await hashPassword(password)

  // ⑤ usersへ保存（emailのUNIQUE制約違反は重複エラーとして扱う）
  let result

  try {
    result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        school_name,
        school_type,
        faculty,
        graduation_year
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `,
      [
        name.trim(),
        normalizedEmail,
        passwordHash,
        schoolName.trim(),
        schoolType,
        typeof faculty === "string" && faculty.trim()
          ? faculty.trim()
          : null,
        year,
      ]
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new Error("そのメールアドレスはすでに使用されています")
    }

    throw error
  }

  const userId = result.rows[0].id;

  await createSession(userId);

  redirect("/articles");
}

type LoginUser = {
  id: number
  passwordHash: string
}

export async function login(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw new Error("メールアドレスとパスワードを入力してください")
  }

  const normalizedEmail = email.trim().toLowerCase()

  const result = await pool.query<LoginUser>(
    `
      SELECT
        id,
        password_hash AS "passwordHash"
      FROM users
      WHERE email = $1
    `,
    [normalizedEmail]
  )

  const user = result.rows[0]

  if (!user) {
    throw new Error("メールアドレスまたはパスワードが違います")
  }

  const isValidPassword = await verifyPassword(
    password,
    user.passwordHash
  )

  if (!isValidPassword) {
    throw new Error("メールアドレスまたはパスワードが違います")
  }

  await createSession(user.id)

  redirect("/articles")
};

export async function logout() {
  await deleteSession()

  redirect("/articles")
};
