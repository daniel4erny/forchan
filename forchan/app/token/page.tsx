import Check from "../login/check";
import RelSearch from "./relSearch";

export default function Token() {
	return (
		<>
			<div className="flex justify-center w-full min-h-screen">
				<div className="w-[70%] min-h-screen bg-[url('/fade.png')] bg-[length:100%_100%] bg-no-repeat bg-top bg-fixed">
					<main className="max-w-3xl mx-auto px-6 pt-24 pb-16 space-y-10">
						<h1 className="text-3xl font-bold mb-4">Your token</h1>
						<Check />
						<RelSearch />
					</main>
				</div>
			</div>
		</>
	);
}
