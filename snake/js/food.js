(function(){
	let Food=window.Food=function () {
		this.w = 30;
		this.body = null;
	}
	//初始化食物
	Food.prototype.init = function() {
		this.x = gm.random(0, gm.map.w-1) * this.w;
		this.y = gm.random(0, gm.map.h-1) * this.w;
		for (let i = 0; i < gm.snake.arry.length; i++) {
			if (gm.check(this, gm.snake.arry[i])) {
				this.init();
				return 0;
			}
		}
		this.body = new Rect(this.x, this.y, "green");
	}
	//食物的绘制
	Food.prototype.draw = function() {
		this.body.draw();
	}
	
})()