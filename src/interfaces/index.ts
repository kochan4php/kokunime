import React from "react";

export interface ChildrenProps {
    children: React.ReactNode;
}

export interface InputProps {
    width?: string;
    type: string;
    name: string;
    placeholder: string;
    autoComplete: string;
    value: string;
    onChange: (e: any) => void;
}

export interface CardAnimeProps {
    src: string;
    alt?: string;
    title: string;
    path: string;
}

export interface ResponseGetAllType {
    title: string;
    release: string;
    genres: string[];
    link: {
        endpoint: string;
        url: string;
        image: string;
    };
}

export interface ResponseGetRekomendasiType {
    title: string;
    endpoint: string;
    image: string;
    url: string;
}
