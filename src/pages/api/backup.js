(function(){"use strict"})()

const fs = require("fs-then")
const fsx = require("fs-extra")

export default async function handler(request, response) {
	
	const { method } = request
	if (method === "POST") {
		const filePath = "./backups/" + Date.now() + ".json"
		try {
			await fsx.ensureFile(filePath)
			await fs.writeFile(filePath, JSON.stringify(request.body))
			return response.status(200).json({path: filePath})
		} catch(err) {
			return response.status(500).json({path: filePath, err: err})
		}
	}

}