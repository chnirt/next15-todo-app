// utils/sanitize.ts
export const sanitizeInput = (input: string): string => {
  const parser = new DOMParser();
  return parser.parseFromString(input, "text/html").body.textContent || "";
};
