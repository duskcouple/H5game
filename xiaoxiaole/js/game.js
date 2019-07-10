(function() {

	var Game = window.Game = function(params) {
		this.canvas = document.getElementById(params.id);
		this.k=0.7;
		this.canvas.width = Math.floor(params.width*this.k);
		this.canvas.height = Math.floor(params.height*this.k);
		this.initX=41*this.k;
		this.initY=295*this.k;
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
			var isMobile = {
				Android: function() {
					return navigator.userAgent.match(/Android/i);
				},
				BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i);
				},
				iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
				},
				Opera: function() {
					return navigator.userAgent.match(/Opera Mini/i);
				},
				Windows: function() {
					return navigator.userAgent.match(/IEMobile/i);
				},
				any: function() {
					return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
				}
			};
			var isPhone = isMobile.Android();
			if (isPhone) {
				//如果是手机访问，将canvas大小设为网页可见的大小，乘以0.96是为了四边留些空隙
				this.k = window.innerWidth/712;
				console.log(this.k)
				this.canvas.width = Math.floor(712*this.k);
				this.canvas.height = Math.floor(1024*this.k);
				this.initX=41*this.k;
				this.initY=295*this.k;
			} else {
				// this.canvas.width = 300;
				// this.canvas.height = 500;
			}
        }
	};
})()
