/**
 * Formats a byte count as a short human-readable size (e.g. "250.0 KB").
 *
 * Shared by FileCard (file metadata line) and FileUploadField (size-limit
 * error messages) so both describe sizes the same way.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
