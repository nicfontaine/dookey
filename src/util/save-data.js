import { writeFile } from '@tauri-apps/api/fs';
// import { resolveResource } from '@tauri-apps/api/path';
const resolve = () => "foo";

const saveData = async function (todos, archives, tags, settings) {

	let d = new Date();
	const fileName = `${d.toISOString().split("T")[0]}-${d.getTime()}-test.json`;
	const contents = JSON.stringify({ todos, archives, tags, settings });
	const filePath = `${settings.backups}/${d.toISOString().split("T")[0]}-${d.getTime()}.json`;

	if (window && window.__TAURI__) {
		// TODO: resolve, and resolveResource throw "navigator not found"
		const backupsAbsolute = resolve(settings.backups);
		await writeFile(fileName, contents, settings.backups);
		return {
			status: resolve(filePath),
			backupsAbsolute,
		};
	} else {
		let status = "";
		const body = JSON.stringify({ contents, filePath, settings });
		const response = await fetch("/api/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
		});
		const res = await response.json();
		if (res.err) {
			status = JSON.stringify(res.err);
		} else {
			status = "Saved to: " + res.path;
		}
		return {
			status,
			backups: res.backups,
		};
	}
};

export default saveData;