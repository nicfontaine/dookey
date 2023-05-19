const fs = require("fs-then");
const fsx = require("fs-extra");
const path = require("path");

export default async function handler (request, response) {
	if (process.env.NEXT_PUBLIC_APP_ENV === "web") return;
	const { method } = request;
	const { settings, filePath, contents } = request.body;
	if (method === "POST") {
		let d = new Date();
		const backupsAbsolute = path.resolve(settings.backups);
		try {
			await fsx.ensureFile(filePath);
			await fs.writeFile(filePath, contents);
			const fullPath = path.resolve(filePath);
			return response.status(200).json({ path: fullPath, backupsAbsolute });
		} catch(err) {
			return response.status(500).json({ path: filePath, err: err });
		}
	}

}