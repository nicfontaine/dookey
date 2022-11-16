// Find ":string" from text, using selectionStart position
// Knowledgeable of newlines, text before colon (like urls)...
// ...and typing in the middle of the current input value

const emojiSubstring = function(text, caret) {
	
	let start = caret    
	if (!text.length || text[start] === " ") {
		return "";
	}
	
	// Increment start to end of word
	let b = text[start]
	while (b && b !== " " &&
		b !== String.fromCharCode(10) &&
		b !== String.fromCharCode(13))
	{
		start++
		b = text[start]
	}

	// Decrement to beginning
	let word = "", str = ""
	let c = text[start-1]
	while (c) {
		if (c === " ") {
			word = ""
			break;
		}
		start--
		c = text[start]
		word += c
		if (c === ":") {
			// Handle "https://abc"
			if (text[start-1] && text[start-1] !== " ") {
				str = ""
				break;
			}
			str = word
			break;
		}
	}

	str = str.split("").reverse().join("")
	return str.split(":")[1] || ""

}

export default emojiSubstring