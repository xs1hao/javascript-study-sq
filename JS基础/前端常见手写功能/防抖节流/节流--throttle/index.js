var throttle = function(func, ms = 1000) {
	let canRun = true
	return function (...args) {
		if (!canRun) return
		canRun = false
		setTimeout(() => {
			func.apply(this, args)
			canRun = true
		}, ms)
	}
}
