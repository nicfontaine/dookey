class TodoShortcuts {
	
	userKeybinds = {};

	#keybinds = {
		edit: this.userKeybinds.edit || "Enter" || "e",
		delete: this.userKeybinds.delete || "Delete",
		tag: this.userKeybinds.tag || "t",
		date: this.userKeybinds.date || "d",
		archive: this.userKeybinds.archive || "a",
		entry: this.userKeybinds.entry || "/",
		details: this.userKeybinds.details || "o" || " ",
		next: this.userKeybinds.next || "ArrowDown" || "Tab",
		prev: this.userKeybinds.prev || "ArrowUp",
		home: this.userKeybinds.home || "Home",
		end: this.userKeybinds.end || "End",
	};

}

export default TodoShortcuts;