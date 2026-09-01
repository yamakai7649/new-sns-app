import { pool } from "@/lib/db"
import { getSession } from "@/lib/auth/session"
import { CurrentUser } from "@/types/user"

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession()

  if (!session) {
    return null
  }

  const result = await pool.query<CurrentUser>(
    `
      SELECT
        id,
        name,
        email,
        school_name AS "schoolName",
        school_type AS "schoolType",
        faculty,
        graduation_year AS "graduationYear"
      FROM users
      WHERE id = $1
    `,
    [session.userId]
  )

  const user = result.rows[0]

  if (!user) {
    return null
  }

  return user
}
