function Game(params) {
	this.canvas = document.getElementById(params.id);
	this.canvas.width = params.width;
	this.canvas.height = params.height;
	this.ctx = this.canvas.getContext("2d");
	this.imgjson = {
		"images": [
			{"name": "bg0","url": "/xiaoxiaole/img/game_bg.png"},
			{"name": "block","url": "/xiaoxiaole/img/qa.png"},
			{"name": "bomb","url": "/xiaoxiaole/img/boom.png"},
			{"name": "bg1","url": "/xiaoxiaole/img/menu_bg.png"}
			
		]
	};
	this.change = [];
	var self = this;
	this.loadimgs(function() {
		self.init(); //回调函数,loadAllresource函数执行完后在调用
		console.log(game)
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
		this.bg = new Background();
		this.loop();
		this.bindEvent();
	},
	loop: function() {
		var self = this;
		(function animation() {
			requestAnimationFrame(animation);
			self.bg.render();
			self.bg.update();
		})()
	},
	bindEvent: function() {
		var self = this;
		this.canvas.addEventListener('click', function(ev) {
			console.log(ev)
			if (ev.offsetX > 30 && ev.offsetY > 205 && ev.offsetX < 467 && ev.offsetY < 647) {
				let y = Math.floor((ev.offsetX - 30) / 64);
				let x = Math.floor((ev.offsetY - 205) / 64);
				self.bg.block[x][y].isclick = true;
				self.change.push(self.bg.block[x][y]);
				if (self.change.length >= 2) {
					console.log(self.change)
					let y1 = self.change[0].cow;
					let x1 = self.change[0].row;
					let y2 = self.change[1].cow;
					let x2 = self.change[1].row;
					//判断两个元素是否相邻
					if ((Math.abs(x1 - x2) == 1&&y1==y2) || (Math.abs(y1 - y2) == 1&&x1==x2)) {

						console.log(x1, y1, x2, y2);
						//先交换位置
						self.bg.swap(self.change);
						
					}else{
						self.change[0].isclick=false;
						self.change.shift()
						
					}
				}

			}

		})
	},
	random: function(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}

};

function Background() {
	//获取background图片
	this.image = game.imglist["bg"+game.random(0,1)];
	//图片坐标
	this.y = 0;
	this.x = 0;
	this.w = 64;
	this.code = [];
	this.block = [];
	this.state = "check";
	this.f = 0;
	this.init();
	this.boomblock=[];
}
Background.prototype = {
	//初始化
	init: function() {
		for (var i = 0; i < 7; i++) {
			this.code[i] = [];
			for (var j = 0; j < 7; j++) {
				this.code[i][j] = game.random(0, 6);
			}
		}
		for (var i = 0; i < 7; i++) {
			this.block[i] = [];
			for (var j = 0; j < 7; j++) {
				let type = this.code[i][j];
				this.block[i][j] = new Block(j, i, type);
			}
		}
		console.log(this)
	},
	//更新block的状态
	update: function() {
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				this.block[i][j].update();
			}
		}
		this.f++;
		if(this.f>100000){
			this.f=0;
		}
		if (this.state == 'check') {
			this.check();
			if(this.boomblock.length>1){
				this.boom();
			}
		}else if (this.state == '消除' && this.f >this.start+ 25) {
			this.state='下落';
			this.dropdown();
		}else if (this.state == '下落' && this.f > this.start+25) {
			this.state='补充';
			this.add();
		}else if (this.state == '补充' && this.f > this.start+25) {
			this.state = 'check';
		}
		 if(this.state=='swap'&&this.f>this.start+10){
			this.test(game.change);
		}
		if(this.state=='backswap'&&this.f>this.start+10){
			this.state='check';
			this.block[game.change[0].row][game.change[0].cow]=new Block(game.change[0].cow,game.change[0].row,game.change[0].type);
			this.block[game.change[1].row][game.change[1].cow]=new Block(game.change[1].cow,game.change[1].row,game.change[1].type);
			game.change=[];
		}
	},
	//渲染背景 及block
	render: function() {
		game.ctx.drawImage(this.image, this.x, this.y, game.canvas.width, game.canvas.height);
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				this.block[i][j].render();
			}
		}

	},
	//检测并消除三个及以上元素
	check: function() {
		//行
		this.temp = JSON.parse(JSON.stringify(this.code));
		for (let i = 0; i < 7; i++) {
			let t = 0;
			let	j = 0;
			while (j < 7) {
				j++;
				if (this.temp[i][t] == this.temp[i][j]) {
					continue;
				} else {
					if (j - t >= 3) {
						for (let x = t; x < j; x++) {
							//this.block[i][x].boom();
						 this.boomblock.push(this.block[i][x]);
						}
						this.state = "消除";
					}
					t = j;
				}
			}
		}
		//列
		 this.temp[7] = []
		for (let i = 0; i < 7; i++) {
			let t = 0;
			let	j = 0;
			while (j < 7) {
				j++;
				if (this.temp[t][i] == this.temp[j][i]) {
					continue;
				} else {
					if (j - t >= 3) {
						for (let x = t; x < j; x++) {
							//this.block[x][i].boom();
							 this.boomblock.push(this.block[x][i]);
						}
						this.state = "消除";
					}
					t = j;
				}
			}
		}
		
		//this.dropdown();

	},
	boom:function(){
		//this.check();
		this.start=this.f;
		for(let i=0,l=this.boomblock.length;i<l;i++){
			this.boomblock[i].boom() 
		}
		this.boomblock=[];
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				if(this.block[i][j].isboom){
					this.temp[i][j]='x';
				}
			}
		}
		this.down = JSON.parse(JSON.stringify(this.temp));
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				let sum = 0;
				if (this.down[j][i] != 'x') {
					let t = j;
					while (t < 6) {
						t++;
						if (this.down[t][i] == 'x') {
							sum++;
						}
					}
					this.down[j][i] = sum;
				}
			}
		}
	},
	//block下落
	dropdown: function() {
		//console.log(this.temp)
		//console.log(this.down)
		this.start=this.f;
		for (var i = 0; i < 7; i++) {
			let count=0
			for (var j = 0; j < 7; j++) {
				if (this.down[j][i] != 'x') {
					let t = this.down[j][i];
					this.temp[j + t][i] = this.code[j][i];
					this.block[j][i].move( i,  t + j, 20);
				}else{
					count++;
				}
			}
			
				for (var j = 0; j < count; j++) {
					this.temp[j][i] = 'x';
				}
			
		}
		
		//this.add()
	},
	add: function() {
		
		this.start=this.f;
		//更新实际元素对象数组
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				if (this.temp[j][i] != 'x') {
					let type = this.temp[j][i];
				   this.block[j][i] = new Block( i,  j, type);
				}
			}
		}
		//补充元素
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				if (this.temp[j][i] == 'x') {
					this.block[j][i] = new Block( i,  j, game.random(0, 6));
					this.block[j][i].y=Math.round(205-(7-j)*63);
					this.block[j][i].move( i,  j);
				}
			}
		}
		//反推code数组
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				let type = this.block[i][j].type;
				this.code[i][j] = type;
			}
		}
		console.log(this.block);
	},
	swap:function(arr){
		this.state='swap';
		this.start=this.f;
		this.block[arr[0].row][arr[0].cow].move(arr[1].cow,arr[1].row,6);
		this.block[arr[1].row][arr[1].cow].move(arr[0].cow,arr[0].row,6);
	},
	backswap:function(arr){
		this.state='backswap';
		this.start=this.f;
		this.block[arr[0].row][arr[0].cow].move(arr[1].cow,arr[1].row,6);
		this.block[arr[1].row][arr[1].cow].move(arr[0].cow,arr[0].row,6);
	},
	test:function(arr){
		this.state='test';
		let oldcode = JSON.parse(JSON.stringify(this.code));
		console.log(arr)
		this.code[arr[0].row][arr[0].cow]=arr[1].type;
		this.code[arr[1].row][arr[1].cow]=arr[0].type;
		this.block[arr[0].row][arr[0].cow]=new Block(arr[0].cow,arr[0].row,arr[1].type);
		this.block[arr[1].row][arr[1].cow]=new Block(arr[1].cow,arr[1].row,arr[0].type);
		this.check();
		if(this.state=='消除'){
			game.change=[];
			this.boom();
		}else if(this.state=='test'){
			this.code[arr[0].row][arr[0].cow]=arr[0].type;
			this.code[arr[1].row][arr[1].cow]=arr[1].type;
			this.backswap(arr);
		}
	}
}

function Block(x, y, type) {
	this.cow=x;
	this.row=y;
	this.w = 63;
	this.type = type;
	this.y = 205+this.row*this.w;
	this.x = 30+this.cow*this.w;
	this.image = game.imglist.block;
	this.boomimg = game.imglist.bomb;
	this.isboom = false;
	this.ismove = false;
	this.isclick = false;
	this.f = 0;
	this.f1 = 0;
	this.step = 0;
}
Block.prototype = {
	update: function() {
		this.f1++;
		if (this.isboom) {
			this.f++;
			if (this.step < 5) {
				game.ctx.drawImage(this.boomimg, this.step * 156, 0, 156, 141, this.x, this.y, this.w, this.w);
			} else {
				if (this.step >= 10) this.step = 9;
				game.ctx.drawImage(this.boomimg, (this.step % 5) * 156, 141, 156, 141, this.x, this.y, this.w, this.w);
			}
			
			this.f % 4 == 0 && this.step++;
		}
		if (this.ismove && this.f1 <= this.endf) {
			this.y += this.dy;
			this.x += this.dx;

		}
		if (this.isclick) {
			game.ctx.strokeStyle = 'red';
			game.ctx.lineWidth = 2;
			game.ctx.strokeRect(this.x, this.y, 63, 63);
		}
	},
	render: function() {
		if (this.isboom) return;
		switch (this.type) {
			case 0:
				game.ctx.drawImage(this.image, 195, 0, this.w, this.w, this.x, this.y, this.w, this.w);
				break;
			case 1:
				game.ctx.drawImage(this.image, 195, 66, this.w, this.w, this.x, this.y, this.w, this.w);
				break;
			case 2:
				game.ctx.drawImage(this.image, 193, 129, this.w, this.w, this.x, this.y, this.w, this.w);
				break;
			case 3:
				game.ctx.drawImage(this.image, 266, 68, this.w, this.w, this.x, this.y, this.w, this.w);
				break;
			case 4:
				game.ctx.drawImage(this.image, 450, 0, this.w, this.w, this.x, this.y, this.w, this.w);
				break;
			case 5:
				game.ctx.drawImage(this.image, 388, 0, this.w, this.w, this.x, this.y, this.w, this.w);
				break;
			case 6:
				game.ctx.drawImage(this.image, 0, 168, this.w - 3, this.w, this.x, this.y, this.w, this.w);
				break;
			default:
				break;
		}
	},
	boom: function() {
		this.isboom = true;
	},
	move: function(x, y, f) {
		f = f || 25;
		this.dx = (x*this.w+30-this.x) / f;
		this.dy = (y*this.w+205-this.y) / f;
		this.endf = this.f1 + f;
		this.ismove = true;
	}

}