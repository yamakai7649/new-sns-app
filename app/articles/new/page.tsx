import { createArticle } from "@/lib/actions/article";
import { JOB_TYPES, INDUSTRIES } from "@/lib/constants/article";
import { getCurrentUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";

export default async function NewArticlePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">就活記事を投稿する</h1>

      <form className="space-y-6" action={createArticle}>
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
            placeholder="例：〇〇社のエンジニア選考体験記"
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
            placeholder="選考の流れや面接内容、感想などを書いてください"
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
            defaultValue=""
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
            defaultValue=""
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
          投稿する
        </button>
      </form>
    </main>
  )
}
