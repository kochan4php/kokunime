"use client";

import dynamic from "next/dynamic";

// The palette (dialog + live search hook) is dead weight until the user asks
// for it: keep it out of the server HTML and the initial client chunk.
const CommandPalette = dynamic(() => import("./command-palette"), { ssr: false });

export default CommandPalette;
