events:{
	adapt:{
		menu:function(e){
			var li=e.data.elements.li;
			e.data.mw=0;
			for(e.data.count in li.get()){
				e.data.mw+=li.eq(e.data.count).width();
				e.data.count==li.length-1?e.data.adapt():false;
			}
		}
	},
	click:{
		menuMore:function(e){
			$(this).find('ul').toggle()
		}
	},
},
mode:{
	'0':function(){
		this.elements.button.add(this.elements.logo).add(this.elements.menu).removeClass('small');
		return this;
	},
	'1':function(){
		this.elements.button.addClass('small');
		this.elements.logo.add(this.elements.menu).removeClass('small');
		return this;
	},
	'2':function(){
		this.elements.menu.removeClass('small');
		this.elements.logo.add(this.elements.button).addClass('small');
		return this;
	},
	'3':function(){
		this.scenario('2');
		this.elements.menu.addClass('small');
		return this;
	},
	'4':function(){
		this.scenario('3');
		return this;
	}
},
resize:function(pw){
	var i,w=pw-this.elements.logo.width()-this.elements.button.width(),
		iw=this.mw/this.count;
		
	this.elements.menu.width(w).parent().width(pw);
	this.elements.menuMore.hide();
	this.elements.li.show();
	this.elements.menuMore.find('ul').children().remove();

	if(pw/this.count<=iw){
		this.elements.menuMore.show();
		
		i=Math.ceil((this.mw-(pw+55))/iw);
		
		this.elements.li.show().eq(i).hide().nextAll().hide();
		this.elements.menuMore.find('ul').prepend(this.elements.li.eq(i).add(this.elements.li.eq(i).nextAll()).clone().show())
	}
},
scenario:function(mode){
	return this.mode[mode].call(this)
},
adapt:function(){
	var mode='2',
		ww=$(window).width(),
		pw=($(window).width()/10)*9;

	if(this.mw<=pw-520){
		mode='0'
	}else if(this.mw<=pw-435){
		mode='1'
	}else if(this.mw<=pw-205){
		mode='2';
	}else if(this.mw<=ww-205){
		mode='2';
		pw=ww;
	}else if(this.mw<=ww){
		mode='3';
		pw=ww;
	}else if(this.mw>=ww){
		mode='4';
		pw=ww;
	}

	this.scenario(mode).resize(pw)
},
count:0,
init:function(e,option){
	e.append($('<span/>',{'class':'more'}).hide().append($('<ul/>')));
	
	this.elements.extend({
		logo:'#logo',
		button:'header .button',
		menu:e,
		li:$(e.find('li').get().reverse()),
		menuMore:e.find('.more')
	},this);
	
	this.menu=Object.create(protoJSON);
	
	return this;
}