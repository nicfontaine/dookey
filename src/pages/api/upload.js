const fs = require("fs-then");

export default async function handler (request, response) {
	
	const { method } = request;
	
	if (method === "POST") {
		try {
			let file = await fs.readFile(filePath);
			return response.status(200).json({ data: file });
		} catch(err) {
			return response.status(500).json({ err: err });
		}
	}

}