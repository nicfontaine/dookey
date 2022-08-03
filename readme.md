🙃 React To**Do** app designed around **key**board shortcuts

## Shortcuts
| Function | Keys |
|:--------------|:-----------|
| Move focus down | `Down` or `Tab` |
| Move focus up | `Up` or `Shift+Tab` |
| Focus first/last | `Home`/`End` |
| Edit todo | `E` or `Enter` |
| Undo Edit | `Esc` |
| Save Edit | `Enter` |
| Add newline to edit/entry | `Ctrl+Enter` |
| Delete todo | `D` or `Delete` |
| Undo delete | `Ctrl+Z` |
| Move todo up | `Ctrl+Shift+Up` |
| Move todo down | `Ctrl+Shift+Down` |
| Focus entry input | `/` |

## Input
**Entry Input**   
- Type, and use `Enter` to add text as a new note
- Use `Shift+Enter` to add a newline while typing  

**Editing a Todo**   
- While focused, use `Enter` to edit
- Use `Ctrl+Enter` to confirm edit (`Enter` will add a newline)
- `Esc` to cancel your edit

## Features
- Markdown support, with Gemoji shortcuts (:+1: 👍️)

## Commands
- `/export` Copy data to clipboard
- `/import` Paste data, and load
- `/save` Save to backup file
- `/open` Load from backup file
- `/nuke` Delete all notes

## Bugs
- Status bar msg won't update, if another msg is still active (before it gets reset)
- Autosize on edit textarea not working
- Entry input getting sized smaller on refresh, since it has no value
- Edit not saving, and focus going back to entry occasionally

## Tauri Bugs
- Scroll overflow not working
- Open from backup file not working
- Entry input has focus, but not getting class

## Todo
- Tags
- Search
- Maybe move edit/active outside of data object
- Textarea styling (height)
- Tags & filters
- Scroll todolist top, on entry submit
- Set caret position after todo-input textSurround()
- Command to populate with random todos
