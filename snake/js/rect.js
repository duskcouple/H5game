(function(){
	//方块类
	let Rect=window.Rect=function(x, y, c) {
		this.w = 30;
		this.x = x;
		this.y = y;
		this.color = c;
	}
	Rect.prototype.draw = function() {
		gm.ctx.beginPath();
		gm.ctx.fillStyle = this.color;
		gm.ctx.fillRect(this.x, this.y, this.w, this.w)
	}
	
})()