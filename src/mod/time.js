class Time {
  
	constructor(clock, setClock) {
		this.clock = clock
    this.setClock = setClock
    this.timer = undefined
	}
    
	start() {
		let that = this
		this.timer = setInterval(() => {
			let d = new Date()
			let h = that.zero(d.getHours().toString())
			let m = that.zero(d.getMinutes().toString())
      let s = that.zero(d.getSeconds().toString())
			that.setClock([h, m, s])
		}, 1000)
	}
	
	stop() {
		clearInterval(this.timer)
	}

	zero(t) {
		return t.length < 2 ? `0${t}` : t
	}
    
}

export default Time