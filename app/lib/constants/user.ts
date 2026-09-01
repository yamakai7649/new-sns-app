export const SCHOOL_TYPES = [
  { value: "university", label: "大学" },
  { value: "graduate_school", label: "大学院" },
  { value: "vocational_school", label: "専門学校" },
  { value: "technical_college", label: "高専" },
  { value: "other", label: "その他" },
] as const

export const SCHOOL_TYPE_VALUES = SCHOOL_TYPES.map((option) => option.value)
