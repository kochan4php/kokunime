import React from "react";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface InputProps {
  width?: string;
  className?: string;
  type: string;
  name: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (e: any) => void;
}

export interface AnimeCardProps {
  src: string;
  alt?: string;
  title: string;
  path: string;
  meta?: string;
  eager?: boolean;
}
