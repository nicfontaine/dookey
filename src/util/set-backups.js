const setBackups = async function (settings) {
	const response = await fetch("/api/set-backups-location", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ backups: settings.backups }),
	});
	const res = await response.json();
	if (res.err) {
		return { err: res.err };
	}
	return { ...settings, backupsAbsolute: res.backupsAbsolute };
};

export default setBackups;