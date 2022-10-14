(function(){"use strict"})()

export default async function handler(request, response) {
	
	const { method } = request
	if (method === "POST") {
		try {
			process.kill(process.pid, "SIGINT")
      return response.status(200).json({})
		} catch(err) {
			return response.status(500).json({err: err})
		}
	}

}