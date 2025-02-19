export function cleanDate(isoDate: string): string {
    if (!isoDate) return "Ej tillgängligt";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Ogiltigt datum";

    // Formatera datumet korrekt
    return date.toLocaleString("sv-SE", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Stockholm",
        hour12: false
    }).replace(", ", " kl. ");
}

//funkrion för att formatera UTC datum till UI 