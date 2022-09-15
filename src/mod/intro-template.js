(function(){"use strict"})()

const introTemplate = {
  todos: [
    {
      "text": "🏫 **Intro**\n- Type out a todo above, and `Enter`\n- Use `Shift + Enter` for a newline\n- Supports markdown!",
      "id": "4dda1c49-1b4a-49bf-8281-c9c800e01bc3",
      "tags": ["Doc"]
    },
    {
      "text": "🤖 **Commands**\n- Type `/` to display commands like saving, loading, etc.\n- Any console output will display in the footer below",
      "id": "ab3201bc-2be9-4096-a19f-f97cb55fc85f",
      "tags": ["Function","Style"]
    },
    {
      "text": "🧭 **Navigation**\n| Function | Shortcut |\n|:--------------|:-----------|\n| Move focus | `Down` & `Up` |\n| Edit todo | `E`, `Enter` |\n| Delete todo | `D`, `Delete` |\n| Add/edit tags | `T` |\n| All shortcuts | [Github ↗](https://github.com/nicfontaine/dookey)|",
      "id": "a0db2091-5d80-48b3-b2cb-70743395d0d4",
      "tags": ["Keyboard"]
    },
    {
      "text": "🚀 **Get Started**\n- Use the command `/nuke` to clear all intro content",
      "id": "dc86715f-5614-4ddf-b187-1b3c5bc73c61"
    },
    {
      "text": "B",
      "id": "7b7ced24-9fd5-4bf8-bd83-18216634e302"
    },
    {
      "text": "C",
      "id": "33646ed3-f8d1-4efa-9e4f-d2532a4d9337"
    }
  ],
  tags: {
    "Doc": {
      "id": "31a73c50-b65a-45f8-9ffc-31fd9424afc1",
      "color": "#E1FCBD"
    },
    "Style": {
      "id": "0e223b87-5c8f-44bd-baed-8bc727cb0b3e",
      "color": "#FCBDF3"
    },
    "Function": {
      "id": "d6704dd7-5aa4-449b-86d2-0d4caa84a3a8",
      "color": "#BEBDFC"
    },
    "Keyboard": {
      "id": "403ac178-502e-44da-85e6-6a1085871bd3",
      "color": "#a1d8ea"
    }
  }
}

export default introTemplate