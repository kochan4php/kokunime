import { JSX } from "react";
import { IconProps } from "./types";

export const ChevronLeftIcon = ({ className = "h-4 w-4" }: IconProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ className = "h-4 w-4" }: IconProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
