"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "./Input";

const Navbar = (): JSX.Element => {
    const router: AppRouterInstance = useRouter();
    const [inputValue, setInputValue] = useState<string | null>();

    const searchFunc = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!inputValue) return;
        router.push(`/search/${inputValue.split(" ").join("+")}`);
    };

    return (
        <header>
            <nav className="bg-gray-900 py-1.5 md:py-2.5 2xl:py-3 z-[999] w-full transition-all duration-300 text-white border-b relative border-b-slate-700">
                <div className="container flex justify-between items-center py-1 relative">
                    <div>
                        <h1 className="text-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent font-bold text-3xl 2xl:text-4xl hidden md:block">
                            <Link
                                href="/"
                                className="selection:bg-yellow-700 selection:text-yellow-400"
                            >
                                Kokunime
                            </Link>
                        </h1>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="hidden md:block mr-4">
                            <form onSubmit={submitHandler}>
                                <Input
                                    type="search"
                                    name="search"
                                    placeholder="Search Anime Here ..."
                                    autoComplete="off"
                                    value={(inputValue as string) || ""}
                                    onChange={searchFunc}
                                />
                            </form>
                        </div>
                    </div>
                </div>
                <div className="container pb-2 md:hidden px-3">
                    <form onSubmit={submitHandler} className="md:hidden">
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search Anime Here ..."
                            autoComplete="off"
                            width="w-full"
                            value={(inputValue as string) || ""}
                            onChange={searchFunc}
                        />
                    </form>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
