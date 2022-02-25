It's a react todo app..

## Shortcuts
|--------------|-----------|
| Move focus down | `Down` or `Tab` |
| Move focus up | `Up` or `Shift+Tab` |
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
- Markdown support

## Commands
- `/export` Copy data to clipboard
- `/import` Paste data, and load
- `/save` Save to backup file
- `/open` Load from backup file
- `/nuke` Delete all notes

## Bugs
- Drag select bug, running handleMain.blur()
- Status bar msg won't update, if another msg is still active (before it gets reset)

## Dev Branch Bugs
- Autosize on edit textarea not working

## Todo
- Maybe move edit/active outside of data object
- Textarea styling (height)
