const path = require("path");

export default async function handler (request, response) {
	const { method } = request;
	const { backups } = request.body;
	if (method === "POST") {
		try {
			let backupsAbsolute = path.resolve(backups);
			// console.log(backupsAbsolute);
			return response.status(200).json({ backupsAbsolute });
		} catch(err) {
			return response.status(500).json({ err: err });
		}
	}
}