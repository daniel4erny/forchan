"use client";

import { useEffect, useState, useCallback } from "react";
import { BoardSlug } from "@/lib/translateBoardSlug";
import PostForm from "./postForm";

type Post = {
	id: number;
	title: string;
	text: string;
	created_at: string;
	rel_key: string;
};

export default function BoardClient({ board }: { board: BoardSlug }) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [formOpen, setFormOpen] = useState(false);
	const [replyText, setReplyText] = useState("");

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

	function openNewPost() {
		setReplyText("");
		setFormOpen(true);
	}

	function openReply(rel_key: string) {
		setReplyText(`>>${rel_key}\n`);
		setFormOpen(true);
	}

	return (
		<div>
			<button
				onClick={openNewPost}
				className="border p-2 px-4 mb-10 cursor-pointer bg-amber-100 hover:bg-amber-200"
			>
				new post
			</button>

			{formOpen && (
				<PostForm
					board={board}
					initialText={replyText}
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
							<span className="font-bold text-[#117743]">{post.title}</span>{" "}
							<span className="text-xs text-gray-600">
								No.{post.id} rel:{post.rel_key} {new Date(post.created_at).toLocaleString()}
							</span>{" "}
							<button
								onClick={() => openReply(post.rel_key)}
								className="text-xs underline cursor-pointer"
							>
								[reply]
							</button>
						</div>
						<p className="whitespace-pre-wrap">{post.text}</p>
					</div>
				))}
			</div>
		</div>
	);
}
