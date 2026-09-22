import translateSlug from "@/lib/translateBoardSlug";
import ThreadClient from "./threadClient";

type PageProps = {
	params: Promise<{
		board_slug: string;
		post_id: string;
	}>;
};

export default async function Thread({ params }: PageProps) {
	const { board_slug, post_id } = await params;
	const board = translateSlug(board_slug);

	return (
		<div className="flex justify-center w-full min-h-screen">
			<div className="w-[70%] min-h-screen bg-[url('/fade.png')] bg-[length:100%_100%] bg-no-repeat bg-top bg-fixed">
				<main className="pt-24 pl-16 pr-16">
					<p className="text-2xl mb-6">{board}</p>
					<ThreadClient board={board} boardSlug={board_slug} postId={Number(post_id)} />
				</main>
			</div>
		</div>
	);
}
