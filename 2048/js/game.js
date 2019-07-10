(function(){
	var Game=window.Game= function(params) {
            this.canvas = document.getElementById(params.id);
            this.canvas.width = params.width;
            this.canvas.height = params.height;
            this.ctx = this.canvas.getContext("2d");
            this.flage = false;
        }
        Game.prototype = {
            init: function () {
                this.grid = new Grid();
                this.grid.init();
                this.grid.randomGrid();
                this.grid.randomGrid();
                this.bindEvent();
				this.bindTouchEvent();
            },
            random: function (min, max) {
                return Math.round(Math.random() * (max - min) + min);
            },
            bindEvent: function () {
                var that = this;
                document.onkeydown = function (ev) {
                    this.result();
                    switch (ev.keyCode) {
                        //上键
                        case 38:
						console.log(this.swipe)
                            this.swipe().up();
                            break;
                        //右键
                        case 39:
                            this.swipe().right();
                            break;
                        //左键
                        case 37:
                            this.swipe().left();
                            break;
                        //下键
                        case 40:
                            this.swipe().down();
                            break;
                    }
                    this.grid.randomGrid();
                }.bind(that)
            },
			swipe:function(){
				var that=this;
				let obj={
					up:function(){
						for (let i = 0; i < 13; i += 4) {
						    for (let j = i; j < i + 4; j++) {
						        for (let k = j; k > i; k--) {
						            that.change(that.grid.body[k - 1], that.grid.body[k])
						        }
						    }
						}
					},
					down:function(){
						for (let i = 0; i < 13; i += 4) {
						    for (let j = i + 3; j >= i; j--) {
						        for (let k = j; k < i + 3; k++) {
						            that.change(that.grid.body[k + 1], that.grid.body[k])
						        }
						    }
						}
					},
					left:function(){
						for (let i = 0; i < 4; i++) {
						    for (let j = i; j <= i + 12; j += 4) {
						        for (let k = j; k > i; k -= 4) {
						            that.change(that.grid.body[k - 4], that.grid.body[k])
						        }
						    }
						}
					},
					right:function(){
						for (let i = 0; i < 4; i++) {
						    for (let j = i + 12; j >= i; j -= 4) {
						        for (let k = j; k < i + 12; k += 4) {
						            that.change(that.grid.body[k + 4], that.grid.body[k])
						        }
						    }
						}
					}
				};
				
				return obj;
			},
			bindTouchEvent:function(){
				var self=this;
				swipe.listenTouchDirection(document, true, function(){
					self.swipe().up();
					 self.grid.randomGrid();
				},function(){
					self.swipe().right();
					 self.grid.randomGrid();
				}, function(){
					self.swipe().down();
					 self.grid.randomGrid();
				}, function(){
					self.swipe().left();
					 self.grid.randomGrid();
				})
				
			},
            change: function (last, next) {
                //移动
                if (last.con == '' && next.con != '') {
                    last.con = next.con;
                    next.con = '';
                    last.render();
                    next.render();
                    last.draw();
                    next.draw();
                }
                //合并
                if (last.con == next.con && last.con != '') {
                    last.con = 2 * last.con;
                    next.con = '';
                    last.render();
                    next.render();
                    last.draw();
                    next.draw();
                }
				let  max=[];
				for (let i = 0; i < 15; i++) {
				        if(this.grid.body[i].con!=''){
							 max.push(this.grid.body[i].con);
						};
				}
				document.querySelector('span').innerHTML=Math.max.apply(Math,max)
            },
            //判断游戏是否结束
            result:function(){
                //判断所有格子是否都有数字
                for(let i=0;i<this.grid.body.length;i++){
                    if(this.grid.body[i].con===''){
                        return;
                    }
                }
                //判断每个格子相邻的格子数字是否相同
                //先比较每行是否有相邻且数字相同的格子
                for(let i=0;i<4;i++){
                    for(let j=i;j<i+12;j +=4){
                        if(this.grid.body[j].con==this.grid.body[j+4].con){
                            return;
                        }
                    }
                }
                //再每列比较每是否有相邻且数字相同的格子
                for(let i=0;i<13;i+=4){
                    for(let j=i;j<i+3;j++){
                        if(this.grid.body[j].con==this.grid.body[j+1].con){
                            return;
                        }
                    }
                }
                alert('game over')
            }
        }
		
	
	
})()