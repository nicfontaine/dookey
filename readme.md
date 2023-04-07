🙃 React To**Do** app designed around **key**board shortcuts

<img src="https://github.com/nicfontaine/dookey/blob/main/public/screenshot-01.png" width="400>

## Shortcuts

#### Main Input
| Function | Keys |
|:--------------|:-----------|
| Add newline | `Shift + Enter` |
| Submit command or todo | `Enter` |
| Show commands & settings | `/` |
##### Focus
| Function | Keys |
|:--------------|:-----------|
| Move focus down | `Down` or `Tab` |
| Move focus up | `Up` or `Shift + Tab` |
| Focus first/last | `Home`/`End` |
| Focus entry input | `/` |

#### Todos
| Function | Keys |
|:--------------|:-----------|
| Edit todo | `E` or `Enter` |
| Add newline | `Enter` |
| Archive/unarchive todo | `A` |
| Undo out of Edit | `Esc` |
| Save Edit | `Ctrl + Enter` |
| Delete todo | `Delete` |
| Undo delete | `Ctrl + Z` |
| Edit tags | `T` |
| Edit date | `D` |
| Move todo up | `Ctrl + Shift + Up` |
| Move todo down | `Ctrl + Shift + Down` |
| Scroll list up | `Ctrl + Up` |
| Scroll list down | `Ctrl + Down` |
| Bold selected text while editing | `Ctrl + B` |
| Italicize selected text while editing | `Ctrl + I` |
| Put selected text in `<details>` tag * | `Ctrl + D` |
\* **NOTE:** `details` uses html, so markdown won't work inside

#### Emojis
| Function | Keys |
|:--------------|:-----------|
| Display search list | `:<text>` |
| Navigate list | `Up` or `Down` |
| Choose from list | `Enter` or `Tab` |

## Input
**Entry Input**   
- Type, and use `Enter` to add text as a new note
- Use `Shift+Enter` to add a newline while typing  

**Editing a Todo**   
- While focused, use `Enter` to edit
- Use `Ctrl+Enter` to confirm edit (`Enter` will add a newline)
- `Esc` to cancel your edit

## Features
- Markdown support, with Gemoji shortcuts (`:+1:` 👍️)

## Commands
- `/export` Copy data to clipboard
- `/import` Paste data, and load
- `/save` Save to backup file
- `/open` Load from backup file
- `/nuke` Delete all notes
- `/help` Goto `readme.md` for more info
- `/clock` Display a clock overlay

## Settings
- `/title <text>` Set a custom header name
- `/size <number>` Set font-size to number (current will display)
- `/center <number>` Center layout to any pixel width (current will display)
- `/full` Full-width layout (default)

## Bugs
- Undo delete archive not working
- Can't write 2 emojis without a space between
- Autosize on edit textarea not working
- Entry input getting sized smaller on refresh, since it has no value
- Focusing down list should scroll tall items totally into view

## Tauri Bugs
- Open from backup file not working
- Entry input has focus, but not getting class

## Todo
- Search
- Maybe move edit/active outside of data object
- Textarea styling (height)
- Tag filters
- Scroll todolist top, on entry submit
- Set caret position after todo-input textSurround()
- Match searched character matches in EmojiPopup list (like slack)
- Add some sort of effect or transition after a command is entered/cleared
- Emoji replace `:abc:` after space, if it matches