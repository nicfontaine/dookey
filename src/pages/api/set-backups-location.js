const path = require("path");
import fs from "fs-extra";

export default async function handler (request, response) {
	if (process.env.NEXT_PUBLIC_APP_ENV === "web") return;
	const { method } = request;
	const { backups } = request.body;
	if (method === "POST") {
		try {
			let backupsAbsolute = path.resolve(backups);
			await fs.access(backupsAbsolute);
			return response.status(200).json({ backupsAbsolute });
		} catch (err) {
			console.log(err);
			return response.status(500).json({ err: err });
		}
	}
}