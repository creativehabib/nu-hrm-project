const parseDateValue = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  if (dateValue instanceof Date) {
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }

  if (typeof dateValue === "string") {
    const plainDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
    if (plainDateMatch) {
      const [, year, month, day] = plainDateMatch;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatProjectDate = (dateValue) => {
  const parsedDate = parseDateValue(dateValue);
  if (!parsedDate) {
    return "-";
  }

  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(parsedDate);
  const month = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(parsedDate);
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(parsedDate);

  return `${day} ${month}, ${year}`;
};
