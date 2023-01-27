import { writeText } from "@tauri-apps/api/clipboard";

const exportData = async function (todos, archives, tags, settings) {
	let txt = JSON.stringify({ todos, archives, tags, settings });
	let status = "";
	if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
		if ("clipboard" in navigator) {
			navigator.clipboard.writeText(txt);
			status = "Copied to clipboard (navigator)";
		} else if (window.__TAURI__) {
			await writeText(txt);
			status = "Copied to clipboard (tauri)";
		} else {
			status = "Failed to copy to clipboard";
		}
		return status;
	}
};

export default exportData;