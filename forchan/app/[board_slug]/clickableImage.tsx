"use client";

import { useState } from "react";

export default function ClickableImage({ src }: { src: string }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={src}
				alt=""
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setOpen(true);
				}}
				className="max-w-xs max-h-64 mb-2 border border-[#b7c5d9] cursor-pointer"
			/>

			{open && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70 cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setOpen(false);
					}}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={src} alt="" className="max-w-[90%] max-h-[90%] object-contain" />
				</div>
			)}
		</>
	);
}
