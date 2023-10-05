import { Events } from "@/types/events";
import { isWithinInterval, parseISO } from "date-fns";

const eventIsActive = (events: Events, date: string) => {
	if (!events) return false;
	const event = events.find((event) => {
		const eventStart = parseISO(event.startTime);
		const eventEnd = parseISO(event.startTime);
		const currentDate = parseISO(date);
		return isWithinInterval(currentDate, { start: eventStart, end: eventEnd });
	});
	return event;
};
export default eventIsActive;
