"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BoardSlug } from "@/lib/translateBoardSlug";
import PostForm from "../postForm";
import ClickableImage from "../clickableImage";

type Post = {
	id: number;
	title: string;
	text: string;
	created_at: string;
	rel_key: string;
	reply_to: number | null;
	image_url: string | null;
};

export default function ThreadClient({
	board,
	boardSlug,
	postId,
}: {
	board: BoardSlug;
	boardSlug: string;
	postId: number;
}) {
	const [post, setPost] = useState<Post | null>(null);
	const [replies, setReplies] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [formOpen, setFormOpen] = useState(false);
	const [replyTo, setReplyTo] = useState<number | null>(null);

	const loadThread = useCallback(async () => {
		setLoading(true);
		const [postRes, repliesRes] = await Promise.all([
			fetch(`/api/py/post/id?post_id=${postId}`),
			fetch(`/api/py/post/replies?post_id=${postId}&page_num=0`),
		]);

		if (postRes.ok) {
			const data = await postRes.json();
			setPost(data.data?.[0] ?? null);
		}

		if (repliesRes.ok) {
			const data = await repliesRes.json();
			setReplies(data.data ?? []);
		}

		setLoading(false);
	}, [postId]);

	useEffect(() => {
		loadThread();
	}, [loadThread]);

	if (loading) return <p>loading...</p>;

	if (!post) return <p>post not found</p>;

	function jumpToPost(id: number) {
		document.getElementById(`post-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
	}

	function openReply(id: number) {
		setReplyTo(id);
		setFormOpen(true);
	}

	return (
		<div>
			<Link href={`/${boardSlug}`} className="text-sm underline cursor-pointer">
				&larr; back to board
			</Link>

			<div id={`post-${post.id}`} className="mt-4 mb-6 bg-[#d6daf0] border border-[#b7c5d9] p-2 text-sm">
				<div className="mb-1">
					<span className="font-bold text-[#117743]">{post.title}</span>{" "}
					<span className="text-xs text-gray-600">
						No.{post.id} rel:{post.rel_key} {new Date(post.created_at).toLocaleString()}
					</span>{" "}
					<button onClick={() => openReply(post.id)} className="text-xs underline cursor-pointer">
						[reply]
					</button>
				</div>
				{post.image_url && <ClickableImage src={post.image_url} />}
				<p className="whitespace-pre-wrap">{post.text}</p>
			</div>

			{formOpen && (
				<PostForm
					board={board}
					replyTo={replyTo}
					onClose={() => setFormOpen(false)}
					onPosted={loadThread}
				/>
			)}

			<div className="flex flex-col gap-4 pl-6">
				{replies.map((reply) => (
					<div key={reply.id} id={`post-${reply.id}`} className="bg-[#eef2ff] border border-[#b7c5d9] p-2 text-sm">
						<div className="mb-1">
							<span className="font-bold text-[#117743]">{reply.title}</span>{" "}
							<span className="text-xs text-gray-600">
								No.{reply.id} rel:{reply.rel_key} {new Date(reply.created_at).toLocaleString()}
							</span>{" "}
							<button onClick={() => openReply(reply.id)} className="text-xs underline cursor-pointer">
								[reply]
							</button>
						</div>
						{reply.reply_to !== null && reply.reply_to !== post.id && (
							<button
								onClick={() => jumpToPost(reply.reply_to as number)}
								className="text-xs underline cursor-pointer text-[#34345c] block mb-1"
							>
								&gt;&gt;{reply.reply_to}
							</button>
						)}
						{reply.image_url && <ClickableImage src={reply.image_url} />}
						<p className="whitespace-pre-wrap">{reply.text}</p>
					</div>
				))}
			</div>
		</div>
	);
}
