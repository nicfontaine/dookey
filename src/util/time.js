export default class Time {

	static #clock;
	static #setClock;

	static createState = (clock, setClock) => {
		this["#clock"] = clock;
		this["#setClock"] = setClock;
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

	static #tick () {
		let d = new Date();
		let h = this.#zero(d.getHours().toString());
		let m = this.#zero(d.getMinutes().toString());
		let s = this.#zero(d.getSeconds().toString());
		this["#setClock"]([h, m, s]);
	}

	static #clear () {
		clearInterval(this.timer);
		this.timer = undefined;
	}

	static #zero (t) {
		return t.length < 2 ? `0${t}` : t;
	}
    
}