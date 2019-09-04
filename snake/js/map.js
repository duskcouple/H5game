(function(){
	//地图类
	let Map=window.Map=function() {
		this.w = gm.canvas.width / 30;
		this.h = gm.canvas.height / 30;
	}
	Map.prototype.draw = function() {
		function line(x, y, x1, y1) {
			
			gm.ctx.strokeStyle = "green";
			gm.ctx.lineWidth = 1;
			gm.ctx.beginPath();
			gm.ctx.moveTo(x, y);
			gm.ctx.lineTo(x1, y1);
			gm.ctx.closePath();
			gm.ctx.stroke();
		}
		let w = 30;
		for (let i = 0; i <= this.w; i++) {
			line(w * i, 0, w * i, gm.canvas.height);
		}
		for (let i = 0; i <= this.h; i++) {
			line(0, w * i, gm.canvas.width, w * i);
		}
	}
})()