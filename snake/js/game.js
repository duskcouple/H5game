(function(){
	//通过Game类初始化游戏
		Game=window.Game=function(params) {
			this.canvas = document.getElementById(params.id);
			this.canvas.width = params.width;
			this.canvas.height = params.height;
			this.ctx = this.canvas.getContext("2d");
			this.timer = null;
			this.score = 0
		}
		//负责游戏背景地图，食物，蛇对象的初始化  只是把游戏场景画出来，游戏并未开始
		Game.prototype.init = function() {
			this.map = new Map(); //地图对象
			this.map.draw(); //画出地图
			this.snake = new Snake(150, 300); //蛇对象
			this.snake.init(); //初始化蛇的位置
			this.snake.draw(); //画出蛇
			this.fd = new Food(); //食物对象
			this.fd.init(); //初始化食物的位置及颜色
			this.fd.draw(); //画出食物
			this.bindEvent(); //给整个游戏绑定键盘事件
			this.start(); //开始游戏 蛇动起来
			this.adaptDevice()//
		}
		//启动游戏  蛇动
		Game.prototype.start = function() {
			this.timer = setInterval(function() {
				//清除画布
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.map.draw(); //绘制地图
				this.snake.update();
				this.snake.draw()
				this.fd.draw(); //绘制食物
			}.bind(this), 200)
		}
		Game.prototype.random = function(min, max) {
			return Math.round(Math.random() * (max - min) + min);
		}
		Game.prototype.check = function(rectA, rectB) {
			let w = 30;
			return !(rectA.x < rectB.x - w || rectA.x > rectB.x + w || rectA.y < rectB.y - w || rectA.y > rectB.y + w);
		}
		Game.prototype.bindEvent = function() {
			var that = this;
			if (this.isPC()) {
				document.onkeydown = function(ev) {
	//上
			if (ev.keyCode === 38 && that.snake.direction != 'D') {
				that.snake.direction = 'U';
			}
			//下
			if (ev.keyCode === 40 && that.snake.direction != 'U') {
				that.snake.direction = 'D';
			}
			//左
			if (ev.keyCode === 37 && that.snake.direction != 'R') {
				that.snake.direction = 'L';
			}
			//右
			if (ev.keyCode === 39 && that.snake.direction != 'L') {
				that.snake.direction = 'R';
			}
	
	
				}
			} else {
				keys[0].onclick = function() {
					that.snake.direction = 'U';
				}
				keys[1].onclick = function() {
					that.snake.direction = 'D';
				}
				keys[2].onclick = function() {
					that.snake.direction = 'L';
				}
				keys[3].onclick = function() {
					that.snake.direction = 'R';
				}
			}
	
	
	
		}
		Game.prototype.adaptDevice = function() {
	
			if (!this.isPC()) {
	
				//如果是手机访问，将canvas大小设为网页可见的大小，乘以0.96是为了四边留些空隙
				let stagew = window.screen.width * 0.95;
				let scale = stagew / this.canvas.width;
				document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale=' +
					scale + ', user-scalable=no');
				console.log(scale)
	
			}
		}
		Game.prototype.isPC = function() {
			var userAgentInfo = navigator.userAgent;
			var Agents = ["Android", "iPhone",
				"SymbianOS", "Windows Phone",
				"iPad", "iPod"
			];
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		}
	
	
	
})()