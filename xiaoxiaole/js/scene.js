(function(){
	var Scene=window.Scene=function(){
		//初始场景
		this.scenenumber=1;
		//实例化
		this.bg=new Background();
		//得分
		this.score=0;
		this.total1Y=-50;
		this.total2Y=-50;
		this.scoreLength=this.score.toString().length;
		this.scorew=58;
		//事件监听
		this.bindEvent();
	}
	Scene.prototype={
		//渲染场景
		render:function(){
			switch (this.scenenumber) {
			//场景1
			case 1:
			    game.ctx.drawImage(game.imglist["bg1"], 0, 0, game.canvas.width, game.canvas.height);
				game.ctx.drawImage(game.imglist["total1"],game.canvas.width/2-149*0.5,this.total1Y);
				game.ctx.drawImage(game.imglist["total2"],game.canvas.width/2-149*0.5,this.total2Y);
			break;
			//场景2
			case 2:
				this.bg.render();
				for(let i=0,l=this.score.toString().length;i<l;i++){
					let n=this.score.toString().charAt(i);
					if(n==8){
				game.ctx.drawImage(game.imglist["score"],0,70,this.scorew,this.scorew,game.canvas.width/2-89+39*i,60,this.scorew,this.scorew);		
					}else if(n==9){
				game.ctx.drawImage(game.imglist["score"],58,70,this.scorew,this.scorew,game.canvas.width/2-89+39*i,60,this.scorew,this.scorew);		
						
					}else{
				  game.ctx.drawImage(game.imglist["score"],0+this.scorew*n,0,this.scorew,this.scorew,game.canvas.width/2-89+39*i,60,this.scorew,this.scorew);
				  }
				}
				
			break;
			//场景3
			case 3:
				
			break;
			}
		},
		//场景数据更新
		update:function(){
			switch (this.scenenumber){
			case 1:
				this.total1Y+=8;
				if(this.total1Y>200)
				{
					this.total1Y=200;
				}
				this.total2Y+=10;
				if(this.total2Y>300)
				{
					this.total2Y=300;
				}
			break;
			case 2:
				this.bg.update();
			break;
			case 3:
				
			break;
			}
		},
		//各个场景的初始设置
		enter:function (number) {
			this.scenenumber=number;
			switch (this.scenenumber) {
			case 1:
				this.total1Y=-50;
				this.total2Y=-50;
			break;
			case 2:
			this.bg.init();
			break;
			case 3:
			break;
			}
		},
		//场景事件监听
		bindEvent:function(){
			var self=this;
			game.canvas.addEventListener("click",function(ev){
				//console.log(ev.clientX,ev.clientY)
					clickhandler(ev.offsetX,ev.offsetY);
			},true) 
			game.canvas.addEventListener("touchstart",function(ev){
				var touch=ev.touches[0];
				clickhandler(touch.offsetX,touch.offsetY);
			},true)
			function clickhandler(mouseX,mouseY){
				//console.log(this)
				switch(self.scenenumber){
					case 1:
						//console.log(mouseX,mouseY);
							self.enter(2);
					
					break;
					case 2:
					       if (mouseX >game.initX && mouseY > game.initY && mouseX < game.initX+7*63 && mouseY < game.initY+7*205) {
					       	let y = Math.floor((mouseX -game.initX) /63);
					       	let x = Math.floor((mouseY - game.initY) /63);
					       	self.bg.block[x][y].isclick = true;
					       	game.change.push(self.bg.block[x][y]);
					       	if (game.change.length >= 2) {
					       		let y1 = game.change[0].cow;
					       		let x1 = game.change[0].row;
					       		let y2 = game.change[1].cow;
					       		let x2 = game.change[1].row;
					       		//判断两个元素是否相邻
					       		if ((Math.abs(x1 - x2) == 1&&y1==y2) || (Math.abs(y1 - y2) == 1&&x1==x2)) {
					       	
					       			//先交换位置
					       			self.bg.swap(game.change);
					       			
					       		}else{
					       			game.change[0].isclick=false;
					       			game.change.shift()
					       			
					       		}
					       	}
					       	
					       }
					break;
				}
			}
			
		}
	}

})()