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
			<div className="flex flex-col gap-2 sm:flex-row">
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
						"h-11 flex-1 border border-border bg-background px-3 font-mono text-[14px] text-foreground placeholder:text-muted-foreground",
						"outline-none transition-colors focus:border-foreground",
						"disabled:opacity-60",
					)}
				/>
				<button
					type="submit"
					disabled={status === "loading"}
					className={cn(
						"h-11 border border-foreground bg-foreground px-5 font-mono text-[13px] font-medium text-background",
						"transition-colors hover:bg-background hover:text-foreground",
						"disabled:opacity-70",
					)}
				>
					{status === "loading" ? "Sending..." : "Get the fleet log"}
				</button>
			</div>
			<p
				role="status"
				aria-live="polite"
				className={cn(
					"mt-3 min-h-[1.25rem] font-mono text-[12px]",
					isSuccess && "text-foreground",
					isError && "text-destructive",
					!isSuccess && !isError && "text-muted-foreground",
				)}
			>
				{message ||
					"Dispatches from a fleet of AI agents running production ops. No spam. Unsubscribe with one click."}
			</p>
		</form>
	);
}
