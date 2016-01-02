events:{
	adapt:{
		menu:function(e){
			var mode,w,ww=$(window).width();
			mode=Math.ceil(ww/480);
			mode>3?mode=3:false;
			mode!=3?w=ww/mode:w=ww/4;
			e.data.getMode(mode).items({
				width:Slonik.ie?w-0.1:w,
				height:w/1.7
			});
		}
	}
},
mode:{
	'1':function(es){
		this.getMode('2');
	},
	'2':function(es){
		es.get('1').css({'clear':'left'}).insertAfter(es.get('3'));
		es.get('4').css({'clear':'left'}).insertAfter(es.get('7'));
	},
	'3':function(es){
		es.get('1').css({'clear':'none'}).insertBefore(es.get('2'));
		es.get('4').css({'clear':'none'}).insertBefore(es.get('5'));
	}	
},
getMode:function(mode){
	this.mode[mode].call(this,this.elements);
	return this;
},
items:function(css){
	for(var i in this.elements.items.get()){
		this.item($(this.elements.items.eq(i)),css);
	}
},
item:function(e,css){
	e.css(css).find('b').css({top:(css.height-e.find('b').height())/2});
	e.find('a[class]').height(css.height+30);
},
init:function(e){
	this.elements.set('menu',e).set('items',e.find('li')).fill('[data-item]',this);
	return this;
}