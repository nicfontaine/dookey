const entryCommands = {

	msg () {},
	clock () {},
	nuke () {},
	export () {},
	full () {},
	title () {},
	help () {},
	backups () {},
	open () {},
	size () {},
	import () {},
	save () {},
	center () {},

	async kill (setStatusMsg) {
		/*
		 * console.log("kill")
		 * const response = await fetch("/api/process-kill", {
		 *   method: "POST",
		 *   headers: {"Content-Type": "application/json"},
		 *   body: JSON.stringify({})
		 * })
		 * const res = await response.json()
		 * if (res.err) setStatusMsg(res.err)
		 */
	},

};

export default entryCommands;