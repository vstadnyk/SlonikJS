render:{
	body:function(e){
		e.data.build()
	},
	content:function(e){
		e.data.contentAdapt(e)
	}
},
events:{
	adapt:{
 		entry:function(e){
			$(this).css({top:($(window).height()-$(this).height())/2})
		},
 		content:function(e){
			e.data.contentAdapt($(this))
		}
	},
	click:{
		close:function(e){
			e.data.elements.body.trigger('close')
		},
		body:function(e){
			if(e.target==this){
				$(this).trigger('close')
			}
		}
	},
	keyup:{
		root:function(e){
			e.keyCode==27?e.data.elements.body.trigger('close'):false
		}
	},
	close:{
		body:function(e){
			$(this).fadeOut(500,function(){
				e.data.option.close();
				Slonik.router.removeHash();
				$(this).remove();
			})
		}
	}
},
build:function(){
	var es=this.elements,
		head=this.option.title?es.head.append(
			es.title.html(this.option.title).add(es.close)
		):es.close;

	head.appendTo(es.entry);

	$.isFunction(this.option.done)&&this.option.done(this)?es.entry.css({display:'inline-block'}).stop().fadeIn(500):false;

	this.option.content?es.body.append(es.entry.append(es.content)):false;
	
	return es.body.appendTo(es.root.length?es.root:$('body'));
},
contentAdapt:function(e){
	var cw=this.elements.head.width()||e.children().outerWidth(),
		hh=this.elements.head.height(),
		ch=e.children().outerHeight(),
		h=$(window).height()/100*98,
		w=$(window).width()/100*98;
		
	if(typeof ch!=='number')return;
	e.css({
		height:ch+hh>h?h-hh:ch,
		width:cw>w?w:cw
	})
},
init:function(e,option){

	this.option=Object.assign({
		title:false,
		content:false,
		done:function(){
			return false
		},
		close:function(){}
	},option);
	
	this.elements.set('root',$('body'));
	
	var es=this.elements.extend({
		body:$('<div/>',{'class':'modal'}),
		entry:$('<div/>',{'class':'entry animate'}),
		head:$('<div/>',{'class':'head'}),
		title:$('<h1/>'),
		close:$('<a/>',{'class':'close animate','title':Slonik.lang.get('close')}),
		content:$('<div/>',{'class':'content'})
	},this);

	return es.body;
}