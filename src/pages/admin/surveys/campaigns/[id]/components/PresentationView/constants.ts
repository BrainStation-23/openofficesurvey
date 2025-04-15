
// Define comparison dimensions
export const COMPARISON_DIMENSIONS = [
  "sbu",
  "gender",
  "location",
  "employment_type",
  "level",
  "employee_type",
  "employee_role"
] as const;

// Define ComparisonDimensionType separately to avoid circular reference
export type ComparisonDimensionType = typeof COMPARISON_DIMENSIONS[number] | "main" | "supervisor" | "none";
