import { $app } from "@/config/strings";

export const consoleBanner = () => {
	let style = [
		"background: linear-gradient(to right, #5433ff, #1090c7, #f15aff);",
		"color: #fff",
		"padding: 10px 20px",
		"line-height: 35px",
	].join(";");
	console.log("%cYou're clever. That makes two of us.", style);
	console.log("%cI'm available for hire.", style);
	console.log("%c Email me at: me@lacymorrow.com.", style);

	style = [
		"background: #000",
		"color: #fff",
		"padding: 10px 20px",
		"line-height: 35px",
	].join(";");
	console.log(`%c${$app.signature}`, style);
}
export default consoleBanner;
