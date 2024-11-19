import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  const date = new Date(dateString);

  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
  const year = date.getFullYear();

  return `${month} ${year}`;
}

export function DateFormatter(dateString) {
  const date = new Date(dateString);

  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function lastLogin(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString();

  return formattedDate;
}

export function diffForHumans(date) {
  const now = new Date();
  const givenDate = new Date(date);
  const diffInSeconds = Math.floor((now - givenDate) / 1000);

  const timeFormats = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  if (diffInSeconds < 0) {
    return "just now";
  }

  for (const format of timeFormats) {
    const interval = Math.floor(diffInSeconds / format.seconds);
    if (interval >= 1) {
      return interval === 1
        ? `1 ${format.unit} ago`
        : `${interval} ${format.unit}s ago`;
    }
  }

  return "just now";
}
