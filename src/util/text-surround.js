const textSurround = function (target, _l, _r) {
	let val = target.value;
	let start = target.selectionStart;
	let end = target.selectionEnd;
	return `${val.slice(0, start)}${_l}${val.slice(start, end)}${_r}${val.slice(end)}`;
};

export default textSurround;