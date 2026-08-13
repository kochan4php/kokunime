import { JSX } from "react";
import { IconProps } from "./types";

export const ArrowDownIcon = ({ className = "h-4 w-4" }: IconProps): JSX.Element => (
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
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);
