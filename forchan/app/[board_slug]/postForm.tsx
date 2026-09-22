"use client";

import { useState } from "react";
import { BoardSlug } from "@/lib/translateBoardSlug";
import { useToken } from "@/lib/useToken";

export default function PostForm({
	board,
	initialText = "",
	replyTo = null,
	onClose,
	onPosted,
}: {
	board: BoardSlug;
	initialText?: string;
	replyTo?: number | null;
	onClose: () => void;
	onPosted: () => void;
}) {
	const { hasToken } = useToken();
	const [title, setTitle] = useState("");
	const [text, setText] = useState(initialText);
	const [image, setImage] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			let image_url: string | null = null;

			if (image) {
				const imageForm = new FormData();
				imageForm.append("file", image);

				const uploadRes = await fetch("/api/py/post/uploadImage", {
					method: "POST",
					body: imageForm,
				});

				if (!uploadRes.ok) {
					const data = await uploadRes.json().catch(() => null);
					setError(data?.detail ?? "failed to upload image");
					return;
				}

				const uploadData = await uploadRes.json();
				image_url = uploadData.url;
			}

			const res = await fetch("/api/py/post/make", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ title, text, board_slug: board, reply_to: replyTo, image_url }),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				setError(data?.detail ?? "failed to post");
				return;
			}

			onPosted();
			onClose();
		} finally {
			setSubmitting(false);
		}
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
					<h2 className="font-bold text-lg">
						{replyTo ? `reply to No.${replyTo}` : "new post"}
					</h2>
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
				<input
					type="file"
					accept="image/png,image/jpeg,image/gif,image/webp"
					onChange={(e) => setImage(e.target.files?.[0] ?? null)}
					className="text-sm"
				/>

				<button
					type="submit"
					disabled={submitting}
					className="border p-2 w-fit px-4 cursor-pointer bg-amber-100 hover:bg-amber-200 disabled:opacity-50"
				>
					{submitting ? "posting..." : "post"}
				</button>
				{!hasToken && (
					<p className="text-xs text-gray-600">
						posting without a token &mdash; your post will be deleted after 3 days
					</p>
				)}
				{error && <p className="text-red-600">{error}</p>}
			</form>
		</div>
	);
}
