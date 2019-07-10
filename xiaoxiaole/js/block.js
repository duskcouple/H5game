
(function(){
	var Block=window.Block=function (x, y, type) {
		this.cow=x;
		this.row=y;
		this.w = Math.round(90*game.k);
		this.sw=63;
		this.type = type;
		this.y = Math.round(game.initY+this.row*this.w);
		this.x = Math.round(game.initX+this.cow*this.w);
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
				game.ctx.lineWidth = 1;
				game.ctx.strokeRect(this.x, this.y, this.w, this.w);
			}
		},
		render: function() {
			if (this.isboom) return;
			switch (this.type) {
				case 0:
					game.ctx.drawImage(this.image, 195, 0, this.sw, this.sw, this.x, this.y, this.w, this.w);
					break;
				case 1:
					game.ctx.drawImage(this.image, 195, 66, this.sw, this.sw, this.x, this.y, this.w, this.w);
					break;
				case 2:
					game.ctx.drawImage(this.image, 193, 129, this.sw, this.sw, this.x, this.y, this.w, this.w);
					break;
				case 3:
					game.ctx.drawImage(this.image, 266, 68, this.sw, this.sw, this.x, this.y, this.w, this.w);
					break;
				case 4:
					game.ctx.drawImage(this.image, 450, 0, this.sw, this.sw, this.x, this.y, this.w, this.w);
					break;
				case 5:
					game.ctx.drawImage(this.image, 388, 0, this.sw, this.sw, this.x, this.y, this.w, this.w);
					break;
				case 6:
					game.ctx.drawImage(this.image, 0, 168, this.sw - 3, this.sw, this.x, this.y, this.w, this.w);
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
			this.dx = (x*this.w+game.initX-this.x) / f;
			this.dy = (y*this.w+game.initY-this.y) / f;
			this.endf = this.f1 + f;
			this.ismove = true;
		}
	
	}
	
	
	
})()