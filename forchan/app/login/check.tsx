'use client';

import { useState } from 'react';
import { useToken } from '@/lib/useToken';
import CopyButton from './copyButton';
import formatDuration from '@/lib/formatDuration';

type TimeRes = {
	created_at: string;
	vanish_at: string;
};

type TokenInfo = {
	age: string;
	createdReadable: string;
	timeUntilVanish: string;
	vanishReadable: string;
};

function formatReadable(date: Date): string {
	return (
		date.toLocaleString('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short',
			timeZone: 'UTC',
		}) + ' UTC'
	);
}

export default function Check() {
	const { token, hasToken, isLoading } = useToken();
	const [showToken, setShowToken] = useState(false);
	const [inputToken, setInputToken] = useState('');
	const [customMode, setCustomMode] = useState(false);
	const [error, setError] = useState('');
	const [loadingCheck, setLoadingCheck] = useState(false);
	const [info, setInfo] = useState<TokenInfo | null>(null);

	if (isLoading) {
		return (
			<section className="w-full">
				<h2 className="font-bold mb-2">3. Check expiration</h2>
				<p className="text-amber-900 text-sm">Loading...</p>
			</section>
		);
	}

	const handleCheck = async (tokenToCheck: string) => {
		setError('');
		setInfo(null);

		const trimmed = tokenToCheck.trim();
		if (!trimmed) {
			setError('Please provide a token');
			return;
		}

		setLoadingCheck(true);
		try {
			const response = await fetch(
				`/api/py/user/checkExpiration?token=${encodeURIComponent(trimmed)}`
			);
			const data = await response.json();

			if (!response.ok) {
				setError(data?.detail || 'wifi ti dako nefacha');
				return;
			}

			const resData = data as TimeRes;
			if (!resData.created_at || !resData.vanish_at) {
				setError('Invalid response from server');
				return;
			}

			const createdDate = new Date(resData.created_at.replace(' ', 'T'));
			const vanishDate = new Date(resData.vanish_at.replace(' ', 'T'));
			const now = new Date();

			const ageMs = now.getTime() - createdDate.getTime();
			const ageStr = ageMs < 60000 ? 'just now' : `${formatDuration(ageMs)} old`;

			const vanishMs = vanishDate.getTime() - now.getTime();
			const vanishLeftStr =
				vanishMs <= 0 ? 'expired' : `${formatDuration(vanishMs)} remaining`;

			setInfo({
				age: ageStr,
				createdReadable: formatReadable(createdDate),
				timeUntilVanish: vanishLeftStr,
				vanishReadable: formatReadable(vanishDate),
			});
		} catch (err: any) {
			setError(err?.detail || err?.message || 'wifi ti dako nefacha');
		} finally {
			setLoadingCheck(false);
		}
	};

	const isCookieMode = hasToken && !customMode;
	const activeToken = isCookieMode ? token || '' : inputToken;

	return (
		<section className="w-full">
			<h2 className="font-bold mb-2">3. Check expiration</h2>

			{isCookieMode ? (
				<>
				<p className='p-1'>You are logged in, check expiration of token in your cookies</p>
				<div className="flex items-center gap-2 mb-3">
					<input
						type={showToken ? 'text' : 'password'}
						value={activeToken}
						readOnly
						className="block w-full min-w-0 border border-amber-900 px-2 py-1 font-mono bg-transparent"
					/>
					<button
						type="button"
						onClick={() => setShowToken(!showToken)}
						className="border border-amber-900 px-3 py-1 cursor-pointer select-none"
					>
						{showToken ? 'Hide' : 'See'}
					</button>
					{activeToken && <CopyButton textToCopy={activeToken} />}
				</div>
				</>
			) : (
				<>
				<p className='p-1'>You are {hasToken? "" : "not"} logged in, check expiration of any token</p>
				<div className="flex items-center gap-2 mb-3">
					<input
						type={showToken ? 'text' : 'password'}
						placeholder="paste your token here"
						value={inputToken}
						onChange={(e) => {
							setInputToken(e.target.value);
							if (error) setError('');
						}}
						className="block w-full min-w-0 border border-amber-900 px-2 py-1 font-mono"
					/>
					<button
						type="button"
						onClick={() => setShowToken(!showToken)}
						className="border border-amber-900 px-3 py-1 cursor-pointer select-none"
					>
						{showToken ? 'Hide' : 'See'}
					</button>
				</div>
				</>
			)}

			{error && <p className="mb-3 text-red-800">{error}</p>}

			<div className="flex items-center gap-2">
				<button
					onClick={() => handleCheck(activeToken)}
					disabled={loadingCheck}
					className="border border-amber-900 bg-amber-400 px-3 py-1 cursor-pointer disabled:opacity-50"
				>
					{loadingCheck ? 'Checking...' : 'Check Expiration'}
				</button>

				{hasToken && (
					<button
						type="button"
						onClick={() => {
							setCustomMode(!customMode);
							setError('');
							setInfo(null);
						}}
						className="text-xs text-amber-900 underline cursor-pointer hover:text-amber-950"
					>
						{customMode ? 'Use saved token' : 'Check another token'}
					</button>
				)}
			</div>

			{info && (
				<div className="mt-4 border-t border-amber-900/20 pt-3 space-y-1.5 text-sm">
					<p>
						<span className="font-semibold text-amber-950">Token age:</span>{' '}
						<span className="text-amber-900">{info.age}</span>
					</p>
					<p>
						<span className="font-semibold text-amber-950">Created at:</span>{' '}
						<span className="text-amber-900">{info.createdReadable}</span>
					</p>
					<p>
						<span className="font-semibold text-amber-950">Time until vanish:</span>{' '}
						<span className="text-amber-900">{info.timeUntilVanish}</span>
					</p>
					<p>
						<span className="font-semibold text-amber-950">Vanish at:</span>{' '}
						<span className="text-amber-900">{info.vanishReadable}</span>
					</p>
				</div>
			)}
		</section>
	);
}