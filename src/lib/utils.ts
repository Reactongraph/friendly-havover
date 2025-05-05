import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (str: unknown): string => {
  if (typeof str !== "string") return "";
  const trimmed = str.trim();
  return trimmed
    ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
    : "";
};
