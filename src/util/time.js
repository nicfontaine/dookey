export default class Time {

	static #clock;
	static #setClock;
	static #clockHour;

	static createState = (clock, setClock, clockHour) => {
		this["#clock"] = clock;
		this["#setClock"] = setClock;
		this["#clockHour"] = clockHour;
	};
    
	static start () {
		this.#tick();
		this.timer = setInterval(this.#tick.bind(this), 1000);
	}
	
	static stop () {
		this.#clear();
		this["#setClock"](["00", "00", "00"]);
	}

	static pauseToggle () {
		this.timer ? this.#clear() : this.start();
	}

	static setClockHour (t) {
		this["#clockHour"] = t;
	}

	static #tick () {
		let d = new Date();
		let h = d.getHours();
		if (this["#clockHour"] === 12 && h > 12) {
			h -= 12;
		}
		h = this.#zero(h.toString());
		let m = this.#zero(d.getMinutes().toString());
		let s = this.#zero(d.getSeconds().toString());
		this["#setClock"]([h, m, s]);
	}

	static #clear () {
		clearInterval(this.timer);
		this.timer = undefined;
	}

	static #zero (t) {
		return t.toString().length < 2 ? `0${t}` : t;
	}
    
}