import translateSlug from "@/lib/translateBoardSlug";

type PageProps = {
	params: Promise<{
		board_slug: string;
	}>;
};

export default async function Board({ params }: PageProps) {
	const { board_slug } = await params;
	const board = translateSlug(board_slug);

	return (
		<div className="flex justify-center w-full min-h-screen">
			<div className="w-[70%] min-h-screen bg-[url('/fade.png')] bg-[length:100%_100%] bg-no-repeat bg-top bg-fixed">
				<main className="pt-24 pl-16 pr-16">
					<p>{board}</p>
				</main>
			</div>
		</div>
	);
}
