class Time {
	#setClock
	constructor(clock, setClock) {
		this.clock = clock
    this.#setClock = setClock
	}
    
	start() {
		this.#tick()
		this.timer = setInterval(this.#tick.bind(this), 1000)
	}
	
	stop() {
		this.#clear()
		this.#setClock(["00","00","00"])
	}

	pauseToggle() {
		this.timer ? this.#clear() : this.start()
	}

	#tick() {
		let d = new Date()
		let h = this.#zero(d.getHours().toString())
		let m = this.#zero(d.getMinutes().toString())
		let s = this.#zero(d.getSeconds().toString())
		this.#setClock([h, m, s])
	}

	#clear() {
		clearInterval(this.timer)
		this.timer = undefined
	}

	#zero(t) {
		return t.length < 2 ? `0${t}` : t
	}
    
}

export default Time