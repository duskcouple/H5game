(function(){
	var Background=window.Background=function () {
		//获取background图片
		this.image = game.imglist["bg"+game.random(0,1)];
		//图片坐标
		this.y = 0;
		this.x = 0;
		this.w = 90*game.k;
		this.code = [];
		this.block = [];
		this.state = "check";
		this.f = 0;
		//this.init();
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
							game.scene.score+=5;
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
							game.scene.score+=5;
						}
						t = j;
					}
				}
			}
			
	
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
						this.block[j][i].y=Math.round(game.initY-(7-j)*this.w);
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
	
})()