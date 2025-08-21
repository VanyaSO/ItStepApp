function displayData(moment: string | Date): string {
  const date = typeof moment === 'string' ? new Date(moment) : moment;
  const today = new Date();

  const diffDays = getDiffDays(date, today);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const days = date.getDate();
  const month = months[date.getMonth() + 1];
  const year = date.getFullYear();

  if (diffDays === 0) {
    return date.toISOString().slice(11, 19);
  } else if (diffDays >= 1 && diffDays <= 3) {
    const formatWordDay = diffDays === 1 ? 'день' : 'дні';
    return `${diffDays} ${formatWordDay} тому ${hours}:${minutes}`;
  } else if (diffDays > 365) {
    return `${days} ${month} ${year}`;
  }

  return `${days} ${month} ${hours}:${minutes}`;
}

export { displayData };

const months: { [key: number]: string } = {
  1: "січень",
  2: "лютий",
  3: "березень",
  4: "квітень",
  5: "травень",
  6: "червень",
  7: "липень",
  8: "серпень",
  9: "вересень",
  10: "жовтень",
  11: "листопад",
  12: "грудень",
};

function getDiffDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
