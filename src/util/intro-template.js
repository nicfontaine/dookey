const introTemplate = {
	todos: [
		{
			"text": "🏫 **Intro**\n- Start typing out a todo above\n- Use `Shift + Enter` to type a newline\n- Create your new todo with `Enter`\n- Supports Markdown and [Emojis ↗](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md) :fire: `:fire:`",
			"id": "4dda1c49-1b4a-49bf-8281-c9c800e01bc3",
			"tags": ["Docs"],
		},
		{
			"text": "💻 **DooKey** is entirely **keyboard-navigable** by design\n- Move focus: `Down`, `Up`\n- Edit todo: `E`\n- Delete todo: `Delete`\n- All Shortcuts: [Github ↗](https://github.com/nicfontaine/dookey)",
			"id": "a0db2091-5d80-48b3-b2cb-70743395d0d4",
			"tags": ["Shortcuts"],
		},
		{
			"text": "🤖 **Input Commands**\n- Type `/` in the top input to display commands &amp; settings\n- You can jump focus from any todo back-to-top via `/`\n",
			"id": "ab3201bc-2be9-4096-a19f-f97cb55fc85f",
			"tags": ["Function", "Style"],
		},
		{
			"text": "🍩 **Extra**\n- `<details>` will collapse info\n- Use `O` or `Space` to toggle open\n<details><summary>More Details...</summary><div>While editing, you can turn highlighted text into details with <code>Ctrl + G</code></div></details>",
			"id": "7b7ced24-9fd5-4bf8-bd83-18216634e302",
			"tags": ["Bonus"],
		},
		{
			"text": "🚀 **Get Started**\n- Use the command `/nuke` to clear all intro content\n- If you refresh before adding any notes, this starter template will return",
			"id": "dc86715f-5614-4ddf-b187-1b3c5bc73c61",
			"tags": ["Complete!"],
		},
	],
	tags: {
		"Docs": {
			"id": "31a73c50-b65a-45f8-9ffc-31fd9424afc1",
			"color": "#E1FCBD",
		},
		"Style": {
			"id": "0e223b87-5c8f-44bd-baed-8bc727cb0b3e",
			"color": "#FCBDF3",
		},
		"Function": {
			"id": "d6704dd7-5aa4-449b-86d2-0d4caa84a3a8",
			"color": "#BEBDFC",
		},
		"Shortcuts": {
			"id": "403ac178-502e-44da-85e6-6a1085871bd3",
			"color": "#a1d8ea",
		},
		"Bonus": {
			"id": "89bc3811-cc96-4d1a-9ea7-ef7b6d8cacda",
			"color": "#a1eabf",
		},
		"Complete!": {
			"id": "79cda71b-e04d-4a76-82a8-96e75f343bdc",
			"color": "#eaa1a1",
		},
	},
	settings: {
		title: "✌️ Welcome",
		fontSize: "17",
		center: "800",
		backups: "./backups/",
		version: process.env.APP_VERSION,
		image: "https://i.redd.it/brd8yuu3zis01.gif",
		density: "md",
	},
};

export default introTemplate;