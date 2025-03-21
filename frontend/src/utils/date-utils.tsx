export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
