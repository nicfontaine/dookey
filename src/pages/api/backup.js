(function(){"use strict"})()

const fs = require("fs-then")
const fsx = require("fs-extra")
const path = require("path")
const { getBackupsPath } = require("./set-backups-location")

export default async function handler(request, response) {
	
	const { method } = request
	const { settings } = request.body
	if (method === "POST") {
		let d = new Date()
		const filePath = `${settings.backups}/${d.toISOString().split("T")[0]}-${d.getTime()}.json`
		const backupsAbsolute = getBackupsPath(settings.backups)
		try {
			await fsx.ensureFile(filePath)
			await fs.writeFile(filePath, JSON.stringify(request.body))
			return response.status(200).json({path: filePath, backupsAbsolute})
		} catch(err) {
			return response.status(500).json({path: filePath, err: err})
		}
	}

}