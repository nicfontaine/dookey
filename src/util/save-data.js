const saveData = async function (todos, archives, tags, settings) {
	let status = "";
	const response = await fetch("/api/backup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ todos, archives, tags, settings }),
	});
	const res = await response.json();
	if (res.err) {
		status = JSON.stringify(res.err);
	}
	status = "Saved to: " + res.path;
	return {
		status,
		backups: res.backups,
	};
};

export default saveData;