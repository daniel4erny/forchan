"use client";

import { useState } from "react";

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(textToCopy);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error("gg", err);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className="border border-amber-900 px-3 py-1 cursor-pointer"
		>
			{isCopied ? "copied!" : "copy"}
		</button>
	);
}
