"use client";

import dynamic from "next/dynamic";

// Cal.com is the single scheduling tool for lacymorrow.com and buildandserve.com.
// The embed touches `window`, so it is loaded client-side only.
const Cal = dynamic(() => import("@calcom/embed-react"), { ssr: false });

export const CAL_USERNAME = "lacymorrow";
export const CAL_DEFAULT_EVENT = "30min";
export const CAL_BOOKING_URL = `https://cal.com/${CAL_USERNAME}/${CAL_DEFAULT_EVENT}`;

interface CalEmbedProps {
	/** Cal.com event slug, e.g. "30min", "15min", "dev". */
	event?: string;
	className?: string;
}

export function CalEmbed({ event = CAL_DEFAULT_EVENT, className }: CalEmbedProps) {
	return (
		<div className={className} style={{ minHeight: 500 }}>
			<Cal
				calLink={`${CAL_USERNAME}/${event}`}
				style={{ width: "100%", height: "100%", overflow: "auto" }}
				config={{ layout: "month_view", theme: "auto" }}
			/>
		</div>
	);
}

export default CalEmbed;
