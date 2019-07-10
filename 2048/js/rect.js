(function(){
	
	
	var Rect=window.Rect=function(params) {
	    this.id = id++;
	    this.y = params.y;
	    this.x = params.x;
	    this.c = { '': '#fff', 2: '#0f0', 4: '#0cf', 8: '#f90', 16: '#0c6', 32: '#fcc', 64: '#f3f', 128: '#06c', 256: '#63c', 512: '#f09', 1024: 'purple' };
	    this.con = '';
	    this.w = 60;
	    this.render();
	}
	Rect.prototype.render = function () {
	    gm.ctx.beginPath();
	    gm.ctx.fillStyle = this.c[this.con];
	    gm.ctx.fillRect(this.x, this.y, this.w, this.w);
	}
	Rect.prototype.draw = function () {
	    gm.ctx.fillStyle = "#fff";
	    // console.log(Math.ceil((this.id % 4) * 80))
	    gm.ctx.font = 'bold 22px serif';
	    gm.ctx.fillText(this.con, (Math.ceil(this.id / 4) - 1) * 80 + 44, ((this.id - 1) % 4) * 80 + 60);
	    gm.ctx.fill();
	}
	Rect.prototype.randomNum = function () {
	    this.con = gm.random(1, 2) * 2;
	    this.render();
	    this.draw();
	}
	
})()