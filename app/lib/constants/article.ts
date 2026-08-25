export const JOB_TYPES = [
  { value: "engineer", label: "エンジニア" },
  { value: "designer", label: "デザイナー" },
  { value: "sales", label: "営業" },
  { value: "marketing", label: "マーケティング" },
  { value: "other", label: "その他" },
] as const

export const INDUSTRIES = [
  { value: "it", label: "IT・Web" },
  { value: "finance", label: "金融" },
  { value: "consulting", label: "コンサル" },
  { value: "manufacturer", label: "メーカー" },
  { value: "advertising", label: "広告・メディア" },
  { value: "other", label: "その他" },
] as const

export const JOB_TYPE_VALUES = JOB_TYPES.map((option) => option.value)
export const INDUSTRY_VALUES = INDUSTRIES.map((option) => option.value)
