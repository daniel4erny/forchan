"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NavItem {
	label: string;
	href: string;
}

const items: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "Login", href: "/login" },
	{ label: "Token", href: "/token" },
];

export default function Nav() {
	const pathname = usePathname();
	const navRef = useRef<HTMLElement>(null);
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
	const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

	const activeIndex = Math.max(0, items.findIndex(item => item.href === pathname));

	useEffect(() => {
		const update = () => {
			const nav = navRef.current;
			const el = itemRefs.current[activeIndex];
			if (!nav || !el) return;
			const navRect = nav.getBoundingClientRect();
			const elRect = el.getBoundingClientRect();
			setIndicator({ left: elRect.left - navRect.left, width: elRect.width, ready: true });
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, [activeIndex]);

	return (
		<nav
			ref={navRef}
			className="relative flex items-center rounded-full border border-black/10 bg-white p-1 shadow-2xl shadow-black/5"
		>
			<div
				aria-hidden
				className="absolute inset-y-1 rounded-full bg-neutral-900 transition-[left,width] duration-300 ease-out"
				style={{ left: indicator.left, width: indicator.width, opacity: indicator.ready ? 1 : 0 }}
			/>
			<ul className="relative z-10 flex items-center gap-1">
				{items.map((item, index) => (
					<li key={item.href} ref={el => { itemRefs.current[index] = el; }}>
						<Link
							href={item.href}
							className={`block rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
								activeIndex === index ? "text-white" : "text-neutral-500 hover:text-neutral-900"
							}`}
						>
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
