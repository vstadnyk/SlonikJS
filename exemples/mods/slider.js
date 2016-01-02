render:{
	items:function(e){
		e.data.option.count=e.length
	},
	root:function(e){
		for(var i in e.data.elements.img.get()){
			Object.assign(new Image(),{
				src:e.data.elements.img.get(i).src,
				data:e.data,
				onload:e.data.preload
			})
		}
	}
},
events:{
	adapt:{
		slogan:function(e){
			e.textFit(470,70)
		},
		links:function(e){
			e.textFit(160,42)
		}
	},
	show:{
		items:function(e){
			e.data.ie?$(this).removeClass('animate').animate({opacity:1},1000):$(this).css({opacity:1})
		},
		slogan:function(e){
			e.data.ie?$(this).removeClass('animate').animate({opacity:1},1000):$(this).css({opacity:1,left:0})
		},
		links:function(e){
			e.data.ie?$(this).animate({bottom:($(window).width()/100)*15},1000):$(this).addClass('animate').css({bottom:'15%'})
		}
	},
	hide:{
		items:function(e){
			e.data.ie?$(this).removeClass('animate').animate({opacity:0},1000):$(this).css({opacity:0})
		}
	},
	cover:{
		items:function(e){
			$(this).addClass('cover').css({backgroundImage:'url('+$(this).find('img').get(0).src+')'}).trigger('show')
		}
	}
},
nav:function(dir){
	!dir?dir='+':false;
	dir=/\+/i.test(dir);

	if(dir){
		this.elements.items.eq(this.current).trigger('hide');
		this.current++;
		if(this.current>=this.option.count){
			this.current=0;
			this.elements.items.trigger('show');
		}
	}else{
		this.current--;
		if(this.current<0){
			this.current=this.option.count-1;
			this.elements.items.not(':eq('+this.current+')').trigger('hide');
		}
		this.elements.items.eq(this.current).trigger('show');
	}
	
},
autoplay:function(){
	var _this=this;
	if(!this.option.autoplay.enable)return this;
	
	this.play=setInterval(function(){
		_this.nav(_this.option.autoplay.dir)
	},this.option.autoplay.speed);
	
	return this;
},
config:Object.create(protoJSON),
preload:function(e){
	this.data.count++;
	return this.data.count==this.data.elements.items.length?this.data.run():this.data
},
run:function(){
	this.elements.items.trigger('cover');
	this.elements.slogan.add(this.elements.links).trigger('show');
	this.autoplay();
},
init:function(e,option){
	this.current=0;
	this.count=0;

	this.option=Object.assign({
		autoplay:{
			speed:1000,
			dir:'+'
		}
	},Object.assign(this.config,option));
	
	this.elements.extend({
		root:e,
		slogan:e.find(this.option.slogan),
		links:e.find(this.option.links),
		mask:e.find(this.option.mask),
		items:$(e.find(this.option.items).get().reverse()),
		img:e.find('img').get()
	},this);
	
	return this;
}