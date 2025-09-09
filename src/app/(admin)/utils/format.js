export function formatDate(d) {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}


export function minutesToHMS(min) {
    const h = Math.floor(min / 60);
    const m = Math.floor(min % 60);
    return `${h}h ${m}m`;
}
