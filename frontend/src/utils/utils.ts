import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formattedPrice = (price: number) => {
  return price.toLocaleString("en-US").replace(/,/g, "'");
};

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
