(function(){
	//蛇类 蛇类由方块组成
	let Snake=window.Snake=function(x, y) {
		this.w = 30; //蛇的大小
		this.arry = []; //数组用来存储蛇的身体
		this.x = x; //蛇的x位置
		this.y = y; //蛇的Y坐标
		this.direction = 'U'; //蛇的默认方向
		this.color=['#66CCFF','#FF9900','#FF33CC']
	}
	Snake.prototype = {
		//初始化蛇的位置及颜色
		init: function() {
			for (let i = 0; i < 3; i++) {
				this.arry[i] = new Rect(this.x, this.y + i * this.w,'#FF9900');
			}
			this.arry[0].color = "red";
		},
		//蛇的绘制
		draw: function() {
			for (let i = 0; i < this.arry.length; i++) {
				this.arry[i].draw()
			}
		},
		check: function() {
			//
			if (this.arry[0].x > gm.canvas.width || this.arry[0].y > gm.canvas.height || this.arry[0].x < 0 || this.arry[
					0].y < 0) {
				clearInterval(gm.timer)
				alert('游戏结束！~')
				return false;
			}
			//自身碰撞检测
			for (let i = 1; i < this.arry.length; i++) {
				if (this.arry[0].x == this.arry[i].x && this.arry[0].y == this.arry[i].y) {
					clearInterval(gm.timer)
					return false;
				}
			}
			return true;
		},
		update: function() {
			//console.log(this.check())
			if (this.check()) {
				console.log('dong')
				this.move();
			}
		},
		//蛇的移动
		move: function() {
			
			var rect = new Rect(this.arry[0].x, this.arry[0].y,'#FF9900' );
			this.arry[0].draw();
			this.arry.splice(1, 0, rect);
			//判断蛇是否吃到食物
			if (this.isEat()) {
				//吃到食物 则生成新的食物
				gm.score += 5;
				score.innerText = '得分：' + gm.score;
				gm.fd = new Food();
				gm.fd.init(); //初始化新食物的位置
			} else {
				this.arry.pop();
			}
			//让蛇按方向移动
			switch (this.direction) {
				case 'U':
					this.arry[0].y -= this.w;
					break;
				case 'D':
					this.arry[0].y += this.w;
					break;
				case 'L':
					this.arry[0].x -= this.w
					break;
				case "R":
					this.arry[0].x += this.w;
					break;
			}
	
		},
		//是否吃到食物的方法
		isEat: function() {
			if (gm.fd.y == this.arry[0].y && gm.fd.x == this.arry[0].x) {
				return true;
			}
			return false;
		}
	}
	
})()