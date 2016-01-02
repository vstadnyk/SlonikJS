render:{
	nav:function(e){
		e.data.build()
	},
	normal:function(e){
		e.hide()
	}
},
events:{
	click:{
		next:function(e){
			e.data.elements.nav.trigger('next').trigger('navigate')
		},
		prev:function(e){
			e.data.elements.nav.trigger('prev').trigger('navigate')
		},
		img:function(e){
			e.data.elements.nav.trigger('next').trigger('navigate')
		},
		full:function(e){
			Slonik.prefix(e.data.elements.modal.get(0),'RequestFullScreen');
			$(this).hide();
			e.data.elements.normal.show();
		},
		normal:function(e){
			Slonik.prefix(document,'CancelFullScreen');
			$(this).hide();
			e.data.elements.full.show();
		}
	},
	adapt:{
		img:function(e){
			var t,h,es=e.data.elements;
			if(!this.src||!es.modal)return;
			t=es.nav.height();
			h=$(window).height()-t;
			if($(this).height()<=h){
				t=((h-$(this).height())/2)+t;
			}
			
			$(this).removeAttr('style').css({top:t,maxHeight:h}).trigger('show');
		}
	},
	show:{
		img:function(e){
			$(this).css({opacity:1})
		}
	},
	hide:{
		img:function(e){
			$(this).css({opacity:0})
		}
	},
	clear:{
		img:function(e){
			setTimeout(function(){
				$(e.target).remove()
			},600);
		}
	},
	left:{
		img:function(e){
			setTimeout(function(){
				$(e.target).css({
					left:-$(e.target).width()
				}).trigger('hide').trigger('clear');
			},500);
		}
	},
	right:{
		img:function(e){
			setTimeout(function(){
				$(e.target).css({
					left:e.data.elements.modal.width()
				}).trigger('hide').trigger('clear');
			},500);
		}
	},
	absolute:{
		img:function(e){
			var es=e.data.elements;
			
			es.img=$(this).clone(true).attr({
				src:Slonik.parseURI(es.items.eq(e.data.option.index).get(0).hash).param.src
			}).removeAttr('style').trigger('hide').appendTo(es.modal);
			
			$(this).addClass('tmp').css({
				left:(es.modal.width()-$(this).width())/2,
				opacity:0.8
			});
		}
	},
	load:{
		img:function(e){
			$(this).trigger('adapt')
		}
	},
	navigate:{
		nav:function(e){
			e.data.option.index>=e.data.option.size?e.data.option.index=0:false;
			e.data.option.index<0?e.data.option.index=e.data.option.size-1:false;
			e.data.elements.counter.text((e.data.option.index+1)+'/'+e.data.option.size);
			e.data.elements.img.trigger('absolute');
		}
	},
	next:{
		nav:function(e){
			e.data.option.index+=1;
			e.data.elements.img.trigger('left');
		}
	},
	prev:{
		nav:function(e){
			e.data.option.index-=1;
			e.data.elements.img.trigger('right');
		}
	}
},
build:function(){
	var es=this.elements;
	es.nav.append(es.prev.add(es.counter).add(es.next).add(es.full).add(es.normal));
},
lead:function(modal){
	modal.elements.body.prepend(
		this.done.module.elements.nav.prepend(
			modal.elements.close
		).add(this.done.module.elements.img)
	);
	
	this.done.module.elements.modal=modal.elements.body;
	
	return Object.assign(new Image(),{
		src:this.done.src,
		module:this.done.module,
		onload:this.done.module.run
	})
},
run:function(){
	var eo=this.module.option,
		es=this.module.elements.extend({
			container:$(eo.container),
			items:$(eo.container).children()
		},this.module);
	
	eo=Object.assign(this.module.option,{
		size:es.items.length
	});
	
	es.counter.text((eo.index+1)+'/'+eo.size).width(80).css({opacity:1});
	es.img.attr({src:this.src});
},
init:function(src,option){
	this.option=Object.assign({
		index:0
	},option);
	
	this.elements.extend({
		document:$(document),
		nav:$('<nav/>',{'class':'head'}),
 		prev:$('<a/>',{'class':'prev animate','title':Slonik.lang.get('previmage')}),
		counter:$('<span/>',{'class':'counter animate'}),
		next:$('<a/>',{'class':'next animate','title':Slonik.lang.get('nextimage')}),
		full:$('<a/>',{'class':'full animate','title':Slonik.lang.get('fullscreen')}),
		normal:$('<a/>',{'class':'normal animate','title':Slonik.lang.get('normalscreen')}),
		img:$('<img>',{'class':'animate'})
	},this);
	
	Slonik.module('modal',false,{
		done:Object.assign(this.lead,{
			module:this,
			src:src
		})
	});
	
	return this;
}