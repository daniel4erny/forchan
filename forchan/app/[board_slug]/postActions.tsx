"use client";

import { useState } from "react";

export default function PostActions({
	postId,
	title,
	text,
	onChanged,
}: {
	postId: number;
	title: string;
	text: string;
	onChanged: () => void;
}) {
	const [editing, setEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(title);
	const [editText, setEditText] = useState(text);
	const [error, setError] = useState<string | null>(null);

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		setError(null);

		const res = await fetch("/api/py/post/edit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ post_id: postId, title: editTitle, text: editText }),
		});

		if (!res.ok) {
			const data = await res.json().catch(() => null);
			setError(data?.detail ?? "failed to edit");
			return;
		}

		setEditing(false);
		onChanged();
	}

	async function handleDelete(e: React.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (!confirm("delete this post?")) return;

		const res = await fetch("/api/py/post/delete", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ post_id: postId }),
		});

		if (!res.ok) {
			const data = await res.json().catch(() => null);
			setError(data?.detail ?? "failed to delete");
			return;
		}

		onChanged();
	}

	if (editing) {
		return (
			<form
				onSubmit={handleSave}
				onClick={(e) => e.stopPropagation()}
				className="flex flex-col gap-2 mt-2"
			>
				<input
					value={editTitle}
					onChange={(e) => setEditTitle(e.target.value)}
					required
					className="border p-2"
				/>
				<textarea
					value={editText}
					onChange={(e) => setEditText(e.target.value)}
					required
					rows={4}
					className="border p-2"
				/>
				<div className="flex gap-2">
					<button type="submit" className="text-xs underline cursor-pointer">
						[save]
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setEditing(false);
						}}
						className="text-xs underline cursor-pointer"
					>
						[cancel]
					</button>
				</div>
				{error && <p className="text-red-600 text-xs">{error}</p>}
			</form>
		);
	}

	return (
		<>
			<button
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setEditing(true);
				}}
				className="text-xs underline cursor-pointer"
			>
				[edit]
			</button>{" "}
			<button onClick={handleDelete} className="text-xs underline cursor-pointer text-red-700">
				[delete]
			</button>
			{error && <p className="text-red-600 text-xs">{error}</p>}
		</>
	);
}
