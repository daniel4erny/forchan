"use client";

import { useState } from "react";
import Link from "next/link";
import { useToken } from "@/lib/useToken";
import { useRelKey } from "@/lib/useRelKey";
import { boardToSlug } from "@/lib/translateBoardSlug";
import PostActions from "../[board_slug]/postActions";
import ClickableImage from "../[board_slug]/clickableImage";

type Post = {
	id: number;
	title: string;
	text: string;
	created_at: string;
	board_slug: string;
	rel_key: string;
	image_url: string | null;
};

export default function RelSearch() {
	const { hasToken } = useToken();
	const myRelKey = useRelKey();
	const [relKey, setRelKey] = useState("");
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [lastSearched, setLastSearched] = useState("");

	async function search(key: string) {
		const trimmed = key.trim();
		if (!trimmed) {
			setError("Please provide a rel key");
			return;
		}

		setError("");
		setLoading(true);
		setLastSearched(trimmed);

		// people paste their token (from /login) here too, not just the rel key ‒ resolve it if so
		let lookupKey = trimmed;
		const checkRes = await fetch(`/api/py/user/checkExpiration?token=${encodeURIComponent(trimmed)}`);
		if (checkRes.ok) {
			const checkData = await checkRes.json();
			if (checkData?.rel_key) lookupKey = checkData.rel_key;
		}

		const res = await fetch(`/api/py/post/relKey?rel_key=${encodeURIComponent(lookupKey)}&page_num=0`);

		if (!res.ok) {
			setError("wifi ti dako nefacha");
			setPosts(null);
			setLoading(false);
			return;
		}

		const data = await res.json();
		setPosts(data.data ?? []);
		setLoading(false);
	}

	function refresh() {
		if (lastSearched) search(lastSearched);
	}

	return (
		<section className="w-full">
			<h2 className="font-bold mb-2">4. Search your posts</h2>
			<h3 className="font-bold mb-2">If you paste your token or rel_key, you can edit or delete your posts</h3>

			<div className="flex items-center gap-2 mb-3">
				<input
					placeholder="paste your token or a rel key here"
					value={relKey}
					onChange={(e) => setRelKey(e.target.value)}
					className="block w-full min-w-0 border border-amber-900 px-2 py-1 font-mono"
				/>
				<button
					onClick={() => search(relKey)}
					disabled={loading}
					className="border border-amber-900 bg-amber-400 px-3 py-1 cursor-pointer disabled:opacity-50"
				>
					{loading ? "Searching..." : "Search"}
				</button>
				{hasToken && myRelKey && (
					<button
						onClick={() => search(myRelKey)}
						className="text-xs text-amber-900 underline cursor-pointer hover:text-amber-950"
					>
						Use my token
					</button>
				)}
			</div>

			{error && <p className="mb-3 text-red-800">{error}</p>}

			{posts && posts.length === 0 && <p>no posts found</p>}

			{posts && posts.length > 0 && (
				<div className="flex flex-col gap-3 mt-3">
					{posts.map((post) => (
						<div key={post.id} className="bg-[#d6daf0] border border-[#b7c5d9] p-2 text-sm">
							<div className="mb-1">
								<Link
									href={`/${boardToSlug(post.board_slug)}/${post.id}`}
									className="font-bold text-[#117743] cursor-pointer hover:underline"
								>
									{post.title}
								</Link>{" "}
								<span className="text-xs text-gray-600">
									No.{post.id} {post.board_slug} {new Date(post.created_at).toLocaleString()}
								</span>{" "}
								{myRelKey && post.rel_key === myRelKey && (
									<PostActions
										postId={post.id}
										title={post.title}
										text={post.text}
										onChanged={refresh}
									/>
								)}
							</div>
							{post.image_url && <ClickableImage src={post.image_url} />}
							<p className="whitespace-pre-wrap">{post.text}</p>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
