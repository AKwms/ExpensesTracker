export function getFormattedDate(date) {
    return date.toLocaleDateString('en-US', {month: 'long', day: '2-digit', year: 'numeric'});
    // you can use date.toISOString().slice(0, 10) to convert the date to a string in the format YYYY-MM-DD
}

export function getDateMinusDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}