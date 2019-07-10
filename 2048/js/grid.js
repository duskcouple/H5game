(function(){
	var Grid=window.Grid=function() {
            this.body = [];
        }
        Grid.prototype = {
            init: function () {
                var k = 0;
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        this.body[k] = new Rect({ x: 20 + i * 80, y: 20 + j * 80 });
                        k++;
                    }
                }
                for (let i = 0; i < 16; i++) {
                    this.body[i].draw();
                }
            },
            randomGrid: function () {
                let n = gm.random(0, 15);
                if (this.body[n].con === '') {
                    this.body[n].randomNum();
                } else {
                    var flage = true;
                    for (let i = 0; i < this.body.length; i++) {
                        if (this.body[i].con == '') {
                            flage = false;
                        }
                    }
                    if (flage) {
                        return;
                    } else {
                        this.randomGrid();
                    }
                }
            }
        }
	
})()