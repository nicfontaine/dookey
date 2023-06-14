// import { resolveResource } from "@tauri-apps/api/path";
const resolve = () => "foo";

const resolveBackupPath = async function (backupsPath) {
	if (window && window.__TAURI__) {
		// TODO: resolve, and resolveResource throw "navigator not found"
		const p = await resolve(backupsPath);
		return p;
	} else {
		const response = await fetch("/api/set-backups-location", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ backups: backupsPath }),
		});
		const res = await response.json();
		if (res.err) {
			return { err: res.err };
		}
		return res.backupsAbsolute;
	}
};

export default resolveBackupPath;
