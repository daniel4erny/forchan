"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BoardSlug } from "@/lib/translateBoardSlug";
import PostForm from "./postForm";
import ClickableImage from "./clickableImage";

type Post = {
	id: number;
	title: string;
	text: string;
	created_at: string;
	rel_key: string;
	reply_to: number | null;
	image_url: string | null;
};

export default function BoardClient({ board, boardSlug }: { board: BoardSlug; boardSlug: string }) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [formOpen, setFormOpen] = useState(false);

	const loadPosts = useCallback(async () => {
		setLoading(true);
		const res = await fetch(`/api/py/post/board?board_slug=${board}&page_num=0`);
		if (res.ok) {
			const data = await res.json();
			setPosts(data.data ?? []);
		}
		setLoading(false);
	}, [board]);

	useEffect(() => {
		loadPosts();
	}, [loadPosts]);

	return (
		<div>
			<button
				onClick={() => setFormOpen(true)}
				className="border p-2 px-4 mb-10 cursor-pointer bg-amber-100 hover:bg-amber-200"
			>
				new post
			</button>

			{formOpen && (
				<PostForm
					board={board}
					onClose={() => setFormOpen(false)}
					onPosted={loadPosts}
				/>
			)}

			{loading && <p>loading...</p>}

			{!loading && posts.length === 0 && <p>no posts yet</p>}

			<div className="flex flex-col gap-6">
				{posts.map((post) => (
					<div key={post.id} className="bg-[#d6daf0] border border-[#b7c5d9] p-2 text-sm">
						<div className="mb-1">
							<Link
								href={`/${boardSlug}/${post.id}`}
								className="font-bold text-[#117743] cursor-pointer hover:underline"
							>
								{post.title}
							</Link>{" "}
							<span className="text-xs text-gray-600">
								No.{post.id} rel:{post.rel_key} {new Date(post.created_at).toLocaleString()}
							</span>{" "}
							<Link href={`/${boardSlug}/${post.id}`} className="text-xs underline cursor-pointer">
								[reply]
							</Link>
						</div>
						{post.image_url && <ClickableImage src={post.image_url} />}
						<p className="whitespace-pre-wrap">{post.text}</p>
					</div>
				))}
			</div>
		</div>
	);
}
