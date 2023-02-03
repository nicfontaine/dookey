/*
 * Find ":string" from text, using selectionStart position
 * Knowledgeable of newlines, text before colon (like urls)...
 * ...and typing in the middle of the current input value
 */

const emojiSubstring = function (text, caret) {
	
	let start = caret; 
	
	if (!text.length || text[start] === " ") {
		return "";
	}
	
	// Increment start to end of word. Stop on: space, \n, \r, or end of value
	let b = text[start];

	while (
		b
		&& b !== " "
		&& b !== String.fromCharCode(10)
		&& b !== String.fromCharCode(13)
	) {
		start++;
		b = text[start];
	}

	// Decrement to beginning
	let word = "", str = "";
	let c = text[start - 1];

	while (c) {
		if (c === " ") {
			word = "";
			break;
		}
		start--;
		c = text[start];
		word += c;
		if (c === ":") {
			// Reject "https://abc"
			// Allow " :abc", ":abc::abc:"
			// Stop at beginning, space, or another : (for back-to-back emojis)
			// TODO: Allow if previous character is an emoji
			if (
				!text[start - 1]
				|| text[start - 1] === " "
				|| text[start - 1] === ":"
			) {
				str = word;
				break;
			} else {
				str = "";
				break;
			}
		}
	}

	str = str.split("").reverse()
		.join("");
	return str.split(":")[1] || "";

};

export default emojiSubstring;