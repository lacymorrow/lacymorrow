"use client";

import { useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

interface FleetSubscribeProps {
	source?: string;
	className?: string;
}

export function FleetSubscribe({ source = "home-hero", className }: FleetSubscribeProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<Status>("idle");
	const [message, setMessage] = useState("");

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (status === "loading") return;
		setStatus("loading");
		setMessage("");

		try {
			const res = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, source }),
			});
			const data = (await res.json().catch(() => ({}))) as { message?: string };
			if (!res.ok) {
				throw new Error(data.message ?? "Subscription failed.");
			}
			setStatus("success");
			setMessage("You’re on the list. First dispatch is coming.");
			setEmail("");
		} catch (error: any) {
			setStatus("error");
			setMessage(error?.message ?? "Subscription failed.");
		}
	};

	const isSuccess = status === "success";
	const isError = status === "error";

	return (
		<form
			onSubmit={onSubmit}
			noValidate
			className={cn("w-full max-w-[520px]", className)}
			aria-label="Subscribe to the Fleet Log newsletter"
		>
			<div className="flex flex-col gap-2.5 sm:flex-row">
				<label htmlFor="fleet-email" className="sr-only">
					Email address
				</label>
				<input
					id="fleet-email"
					type="email"
					required
					autoComplete="email"
					inputMode="email"
					placeholder="you@domain.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={status === "loading"}
					className={cn(
						"h-12 flex-1 rounded-full border border-hair bg-card-mood px-5 font-mono text-[14px] text-ink placeholder:text-ink-mute",
						"outline-none transition-colors focus:border-agent",
						"disabled:opacity-60",
					)}
				/>
				<button
					type="submit"
					disabled={status === "loading"}
					className={cn(
						"h-12 rounded-full bg-ink px-6 text-[14px] font-medium text-ground",
						"transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px] hover:shadow-agent/45",
						"disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none",
					)}
				>
					{status === "loading" ? "Sending..." : "Read the fleet log"}
				</button>
			</div>
			<p
				role="status"
				aria-live="polite"
				className={cn(
					"mt-3 min-h-[1.25rem] font-mono text-[12px]",
					isSuccess && "text-shell",
					isError && "text-agent",
					!isSuccess && !isError && "text-ink-mute",
				)}
			>
				{message ||
					"Dispatches from a year of running my life on 13 AI agents. No spam. Unsubscribe with one click."}
			</p>
		</form>
	);
}
