(function() {

	var Game = window.Game = function(params) {
		this.canvas = document.getElementById(params.id);
		this.canvas.width =params.width;
		this.canvas.height = params.height;
		this.initX=30;
		this.initY=205;
		this.ctx = this.canvas.getContext("2d");
		this.imgjson = {
			"images": [{
					"name": "bg0",
					"url": "/xiaoxiaole/img/game_bg.png"
				},
				{
					"name": "block",
					"url": "/xiaoxiaole/img/qa.png"
				},
				{
					"name": "bomb",
					"url": "/xiaoxiaole/img/boom.png"
				},
				{
					"name": "bg1",
					"url": "/xiaoxiaole/img/menu_bg.png"
				},
				{
					"name": "total1",
					"url": "/xiaoxiaole/img/menu_bg_total_02.png"
				},
				{
					"name": "total2",
					"url": "/xiaoxiaole/img/menu_bg_total_04.png"
				},
				{
					"name": "score",
					"url": "/xiaoxiaole/img/game_in_ui.png"
				},
			]
		};
		this.change = [];
		var self = this;
		this.loadimgs(function() {
			self.init(); //回调函数,loadAllresource函数执行完后在调用
		});
	}
	Game.prototype = {
		loadimgs: function(callback) {
			this.imglist = {};
			var self = this;
			var alreadyDoneNumber = 0;
			var Robj = this.imgjson;
			for (var i = 0; i < Robj.images.length; i++) {
				self.imglist[Robj.images[i].name] = new Image();
				self.imglist[Robj.images[i].name].src = Robj.images[i].url;
				self.imglist[Robj.images[i].name].onload = function() {
					alreadyDoneNumber++;
					self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
					var txt = "正在加载图片资源" + alreadyDoneNumber + "/" + Robj.images.length + "请稍后"
					self.ctx.textAlign = "center";
					self.ctx.font = "20px 微软雅黑";
					self.ctx.fillText(txt, self.canvas.width / 2, self.canvas.height * (1 - 0.618));
					if (alreadyDoneNumber == Robj.images.length) {
						callback();
					}
				}
			}
		},
		init: function() {
			this.scene = new Scene();
			this.adaptDevice()
			// this.bg = new Background();
			this.loop();
			// this.bindEvent();
			
		},
		loop: function() {
			var self = this;
			(function animation() {
				requestAnimationFrame(animation);
				self.scene.render();
				self.scene.update();
			})()
		},
		random: function(min, max) {
			return Math.round(Math.random() * (max - min) + min);
		},
		adaptDevice: function() {
			
			if (!this.isPC()) {
				
				//如果是手机访问，将canvas大小设为网页可见的大小，乘以0.96是为了四边留些空隙
				 let stagew=window.screen.width*0.95;
				let scale = stagew / this.canvas.width;
				document.querySelector('meta[name="viewport"]').setAttribute('content','width=device-width,initial-scale=' + scale + ', user-scalable=no');
				console.log(scale)
				
			} 
        },
		isPC:function (){
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
	};
})()
