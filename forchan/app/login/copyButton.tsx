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
      className="px-4 py-2 bg-amber-500 text-amber-950 rounded-md hover:bg-amber-700 transition-colors"
    >
      {isCopied ? "copied!" : "copy"}
    </button>
  );
}