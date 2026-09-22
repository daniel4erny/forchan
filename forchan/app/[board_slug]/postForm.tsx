"use client";

import { useState } from "react";
import { BoardSlug } from "@/lib/translateBoardSlug";

export default function PostForm({
	board,
	initialText = "",
	onClose,
	onPosted,
}: {
	board: BoardSlug;
	initialText?: string;
	onClose: () => void;
	onPosted: () => void;
}) {
	const [title, setTitle] = useState("");
	const [text, setText] = useState(initialText);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		const res = await fetch("/api/py/post/make", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ title, text, board_slug: board }),
		});

		if (!res.ok) {
			const data = await res.json().catch(() => null);
			setError(data?.detail ?? "failed to post");
			return;
		}

		onPosted();
		onClose();
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
			onClick={onClose}
		>
			<form
				onSubmit={handleSubmit}
				onClick={(e) => e.stopPropagation()}
				className="bg-white w-[90%] max-w-lg flex flex-col gap-2 p-6 border"
			>
				<div className="flex justify-between items-center mb-2">
					<h2 className="font-bold text-lg">new post</h2>
					<button type="button" onClick={onClose} className="px-2 cursor-pointer">
						x
					</button>
				</div>

				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="title"
					required
					className="border p-2"
				/>
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="text"
					required
					rows={6}
					className="border p-2"
				/>
				<button type="submit" className="border p-2 w-fit px-4 cursor-pointer bg-amber-100 hover:bg-amber-200">
					post
				</button>
				{error && <p className="text-red-600">{error}</p>}
			</form>
		</div>
	);
}
