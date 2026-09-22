import { notFound } from "next/navigation";

const boards = {
	t: "technology",
	g: "games",
	s: "sports",
} as const;

export type BoardSlug = (typeof boards)[keyof typeof boards];

export default function translateSlug(slug: string): BoardSlug {
	const board = boards[slug as keyof typeof boards];
	if (!board) notFound();
	return board;
}

export function boardToSlug(board: string): string {
	const entry = Object.entries(boards).find(([, name]) => name === board);
	return entry ? entry[0] : board;
}
