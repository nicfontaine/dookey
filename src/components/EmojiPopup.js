import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { gemoji } from "gemoji";
import FuzzySearch from "fuzzy-search";
import emojiSubstring from "../util/emoji-substring";

const fuzzysearch = new FuzzySearch(gemoji, ["names"], { sort: true });
var index = 0;

const EmojiPopup = ({ active, setActive, inputText, setInputText, keyUpEvent, keyDownEvent, listMax = 6 }) => {

	const [emojiList, setEmojiList] = useState([]);
	const [emojiSearchString, setEmojiSearchString] = useState("");
	const [emojiSelect, setEmojiSelect] = useState("");

	// Keyevents
	useEffect(() => { 
		if (Object.keys(keyDownEvent).length) keyDown(keyDownEvent);
	}, [keyDownEvent]);
	useEffect(() => { 
		if (Object.keys(keyUpEvent).length) keyUp(keyUpEvent);
	}, [keyUpEvent]);

	useEffect(() => {
		list.update(emojiSearchString);
	}, [emojiSearchString]);

	useEffect(() => {
		if (emojiSelect) {
			setInputText(inputText.replace(`:${emojiSearchString}`, emojiSelect));
			setActive(false);
			setEmojiSearchString("");
			setEmojiSelect("");
		}
	}, [emojiSelect]);

	const list = {

		next () {
			index = (index + 1) % list.checkMax();
			list.update();
		},

		prev () {
			index = index - 1 < 0 ? list.checkMax() - 1 : index - 1;
			list.update();
		},

		select () {
			setEmojiSelect(emojiList[index].emoji);
		},

		checkMax: () => listMax < emojiList.length ? listMax : emojiList.length,

		update (str) {
			let list = emojiList.slice();
			if (str && str.length) {
				let search = fuzzysearch.search(str).slice(0, listMax);
				list = search.length ? search : [];
			}
			if (index >= list.length) index = 0;
			list = list.map((s, i) => {
				s.active = i === index ? true : false;
				return s;
			});
			setEmojiList(list);
		},
		
	};

	const keyDown = function (e) {
		const key = e.key;
		if (active) {
			if (key === "ArrowUp") {
				list.prev();
			} else if (key === "ArrowDown") {
				list.next();
			} else if (key === "Enter" || key === "Tab") {
				list.select();
			} else if (key === "Escape") {
				/*
				 * NOTE: This is overridden by keyup check. So would need to set a bypass, and determine a reset case
				 * setActive(false)
				 */
			}
		}
	};

	const keyUp = function (e) {
		const key = e.key;
		const start = e.target.selectionStart - 1;
		var _active = active;
		// Possible state change cases
		if (key === ":") {
			_active = true;
		} else if (key === " ") {
			_active = false;
		} else if (key === "Backspace" && inputText[start] === ":") {
			_active = false;
		}
		const str = emojiSubstring(inputText, start);
		_active =  str.length ? true : false;
		setEmojiSearchString(str);
		setActive(_active);
	};

	return (
		<>
			{ active &&
				<div className="emoji-list-container">
					<div className="emoji-list">
						{ emojiList.length ? emojiList.map((emoji) => {
							return (
								<div className={`emoji-list-item ${emoji.active ? "active" : ""}`} key={emoji.emoji}>
									<div className="emoji">{emoji.emoji}</div>
									<code className="code">:{emoji.names.join(",")}</code>
								</div>
							);
						}) : <div className="emoji-list-item-null">{emojiSearchString.length ? "No matches found" : "type for emoji search..."}</div> }
					</div>
					<div className="emoji-list-how-to"><code>Up/Down</code> to change selection. <code>Enter</code> to select</div>
				</div>
			}
		</>
	);  
	
};

EmojiPopup.propTypes = {
	active: PropTypes.bool,
	setActive: PropTypes.func,
	inputText: PropTypes.string,
	setInputText: PropTypes.func,
	keyUpEvent: PropTypes.object,
	keyDownEvent: PropTypes.object,
	listMax: PropTypes.number,
};

export default EmojiPopup;