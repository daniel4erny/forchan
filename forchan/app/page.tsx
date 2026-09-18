import Link from "next/link";

export default function Home() {
	const boards = [
		{
			title: "TECHNOLOGY",
			link: "/t",
			description: "board about technology, post mentioning windows will be automatically deleted",
		},
		{
			title: "SPORT",
			link: "/s",
			description: "board about like gym idk I dont play football",
		},
		{
			title: "GAMES",
			link: "/g",
			description: "games or something, just play diablo 2",
		},
	];

	return (
		<div className="flex justify-center w-full min-h-screen">
			<div className="w-[70%] min-h-screen bg-[url('/fade.png')] bg-[length:100%_100%] bg-no-repeat bg-top bg-fixed">
				<main className="pt-24 pl-16 pr-16">
					<p className="text-2xl mb-3 text-center text-body">
						Hello, welcome to the forchan™ for gods
					</p>
					{boards.map((board) => (
						<div key={board.link} className="mb-6">
							<Link
								href={board.link}
								className="inline-block text-xl font-bold underline decoration-2 underline-offset-4 decoration-black/30 hover:decoration-black hover:text-amber-950 transition-colors"
							>
								<h1>{board.title}</h1>
							</Link>
							<p>{board.description}</p>
						</div>
					))}
				</main>
			</div>
		</div>
	);
}
