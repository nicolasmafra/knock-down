const looper = {
	maxDeviation: 50,
	period: 1000/60,
	requestBeforeRender: false,
	renderFunction: null,
	
	requestAnimationFrameId: null,
	
	startTime: null,
	delta: 0,
	lastRenderTime: null,
	totalTime: 0,
	ticks: 0,
	delayed: 0,
	
	saveFpsHistory: false,
	fpsHistoryLength: 30,
	fpsHistory: [],
	
	setFps: function(fps) {
		this.period = 1000/fps;
	},
	getFps: function() {
		return 1000/this.period;
	},
	getCurrentFps: function() {
		return 1000/this.delta;
	},
	getFpsAverage: function() {
		const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
		return (sum / this.fpsHistory.length) || 0;
	},

	isRunning: function() {
		return this.requestAnimationFrameId != null;
	},
	
	start: function() {
		this.stop();
		
		const now = new Date();
		this.startTime = now;
		this.delta = 0;
		this.lastRenderTime = now;
		this.totalTime = 0;
		this.ticks = 0;
		this.delayed = 0;
		this.fpsHistory = [];
		
		this.requestAnimationFrameId = requestAnimationFrame(() => this.render());
	},
	
	stop: function() {
		if (this.requestAnimationFrameId) {
			cancelAnimationFrame(this.requestAnimationFrameId);
			this.requestAnimationFrameId = null;
		}
	},
	
	render: function() {

		if (this.requestBeforeRender) {
			this.requestAnimationFrameId = requestAnimationFrame(() => this.render());
		}
		
		const now = new Date();
		const diff = now - this.lastRenderTime;
		const remaining = (this.period - this.delayed) - diff;
		
		if (remaining <= this.maxDeviation) {
			this.delta = diff;
			this.lastRenderTime = now;
			this.totalTime = now - this.startTime;
			this.ticks++;
			this.delayed = diff > this.period ? (diff - this.period) : 0;
			
			if (this.saveFpsHistory && this.ticks > 1) {
				this.fpsHistory.push(this.getCurrentFps());
				if (this.fpsHistory.length > this.fpsHistoryLength) {
					this.fpsHistory.shift();
				}
			}
		
			if (this.renderFunction) {
				this.renderFunction(this.delta, this.totalTime);
			}
		}
		
		if (!this.requestBeforeRender) {
			this.requestAnimationFrameId = requestAnimationFrame(() => this.render());
		}
	},
};