export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function sanitizeSlugInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');
}

export function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
