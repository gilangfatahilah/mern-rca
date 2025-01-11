export const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}