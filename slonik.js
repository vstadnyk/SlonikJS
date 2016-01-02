'use strict';
var protoSlonik=Object.create(Object.prototype),
	protoElements=Object.create(Object.prototype),
	Slonik=Object.create(protoSlonik),
	protoJSON=Object.create(protoSlonik),
	log=function(v){console.log(v)};

protoSlonik.extend=function(o){
	Object.assign(this,o);
	return this;
};

protoSlonik.init=function(fn){
	var _this=this;
	$(function(){
		$.isFunction(fn)?fn.call(_this):false
	});
	return this;
};

protoElements.render=function(obj){
	var $e,name,event;
	
	if(this.rendered)return this;
	
	for(name in this){
		if(!this.isElement(name))continue;
		$e=this.get(name);

		obj.render&&$.isFunction(obj.render[name])?obj.render[name](Object.assign($e,{data:obj})):false;
		
		if(!obj.events)continue;
		
		this.adaptElement(name,obj);
		
		for(event in obj.events){
			$.isFunction(obj.events[event][name])?$e.on(event,obj,obj.events[event][name]):false;
		}
	}
	
	this.rendered=true;
	return this;
};

protoElements.adaptElement=function(e,obj,index){
	var $e;
	if(!obj.events||!obj.events.adapt||!$.isFunction(obj.events.adapt[e]))return this;
	index=index||0;
	
	for(index in this.get(e).get()){
		$e=this.get(e).eq(index);
		this.isElement(e)?obj.events.adapt[e].call($e,{
			data:obj,
			getCss:function(v){
				return parseInt(document.defaultView.getComputedStyle($e,null).getPropertyValue(v))
			},
			textFit:function(w,f){
				$($e).css({fontSize:$($e).width()<=w?Math.ceil(($($e).width()/w)*f):f})
			},
			target:this.get(e).get(index)
		}):false;
	}
	return this;
};

protoElements.adapt=function(obj){
	for(var e in this){
		this.adaptElement(e,obj)
	}
	return this;
};

protoElements.set=function(key,value){
	!this[key]||this[key]!=value?this[key]=value:false
	return this;
};

protoElements.get=function(key){
	return this[key]||false;
};

protoElements.isElement=function(key){
	return this[key][0]&&this[key][0].tagName?true:false
};

protoElements.extend=function(o,obj){
	var _this=this;

	$(function(){
		$.each(o,function(i,v){
			_this[i]=$(v)
		});
		_this.render(obj);
	});
	
	return this;
};

protoElements.fill=function(selector,obj){
	var e,i,key,data,elements=document.querySelectorAll(selector);

	for(i in elements){
		e=elements[i];
		if(!e.dataset&&!selector.match('data'))continue;
		selector=selector.replace(/[^A-Za-z-;]/g,'').replace('data-','');
		this.set(e.dataset[selector],$(e))
	}
	
	if(!obj)return this;
	
	this.rendered=false;
	this.render(obj);
	
	return this;
}

protoJSON.extend({
	get:function(a){
		return this[a]
	},
	set:function(a,b){
		this[a]=b;
		return this;
	}
});

Slonik.config=Object.create(protoJSON);
Slonik.lang=Object.create(protoJSON);

Slonik.extend({
	elements:Object.create(protoElements),
	modules:Object.create(Object.prototype),
	request:{
		get:function(url,option){
			return this.load(url,option)
		},
		post:function(url,option){
			return $.ajax(Object.assign({
				url:url,
				type:'post'
			},option))
		},
		load:function(url,option){
			return $.ajax(Object.assign({
				url:url,
				type:'get',
				async:true
			},option))
		},
		json:function(url){
			return JSON.parse(this.load(url,{
				async:false,
				cache:true
			}).responseText)
		}
	},
	require:function(url){
		return eval('({'+this.request.load(url,{
			async:false,
			cache:true
		}).responseText+'})');
	},
	expand:function(path){
		var dir=this.config.get('expansionsDir')||'assets/slonik/core/expansions/';
		this[path]=this.require(dir+path+'.js');
		return this[path];
	},
	module:function(path,e,option){
 		var module;
		
		if(!this.modules.hasOwnProperty(path)){
			this.modules[path]=this.require(this.config.get('modsDir')+path+'.js');
		}
		
		module=this.modules[path];
		module.elements=Object.create(protoElements);
		
		if((module.config)&&(!Object.keys(module.config).length)){
			module.config.extend(
				this.request.json(this.config.get('configDir')+'mods/'+path.split('/')[0]+'.json')
			)
		}

		if((module.lang)&&(!Object.keys(module.lang).length)){
			module.lang.extend(
				this.request.json(this.config.get('langDir')+this.config.get('lang')+'/mods/'+path.split('/')[0]+'.json')
			)
			
			this.parse?this.parse.element(e,module):false;
		}
		
		return module.init(e,option);
	},
	router:{
		table:Object.create(protoSlonik),
		removeHash:function(){
			'pushState'in history?history.pushState('',document.title,location.pathname+location.search):location.hash='';
		},
		preAdapt:function(e){
			clearTimeout(e.data.timer);
			e.data.timer=setTimeout(e.data.adapt,100);
		},
		adapt:function(){
			for(var module in Slonik.modules){
				Slonik.modules[module].elements.adapt(Slonik.modules[module])
			}
			Slonik.elements.adapt(Slonik);
		},
		init:function(e){
			var way=location.hash.replace('#','').split('='),
				a=!e?this:Slonik.router,
				param,
				option,
				paramJSON=false;

			window.addEventListener('hashchange',a.init);

			$(window)
				.off('resize')
				.on('resize',a,a.preAdapt);
			
			if(!(way.length-1)&&a.current){
				a.current.trigger('close')
			}
			
			if(!(way.length-1)||!a.table[way[0]]||!$.isFunction(a.table[way[0]][way[1].split('&')[0]]))return;
			
			param=way[1].split('&')[1];

			try{
				paramJSON=decodeURIComponent(param)?JSON.parse(decodeURIComponent(param)):false;
			}catch(er){
				paramJSON=false;
			}
			
			option=param&&paramJSON?paramJSON:param;

			a.table[way[0]][way[1].split('&')[0]](option,a);
		}
	},
	parseURI:function(hash){
		var uri=Object.create(Object.prototype);
		hash=hash.replace('#','').split('=');
		uri.type=hash[0];
		hash=hash[1].split('&');
		uri.name=hash[0];
		uri.param=JSON.parse(decodeURIComponent(hash[1]))
		return uri;
	},
	prefix:function(obj,method){
		var i,prefix=['webkit','moz','ms','o',''];
		for(i in prefix){
			$.isFunction(obj[prefix[i]+method])?obj[prefix[i]+method]():obj[prefix[i]+method];
		}
	},
	ie:navigator.userAgent.match(/msie/i)||navigator.userAgent.match(/trident/i)||navigator.userAgent.match(/edge/i)?true:false
});

Slonik.config.extend(
	Slonik.request.json('/assets/slonik/config/global.json')
);

Slonik.lang.extend(
	Slonik.request.json('/assets/slonik/lang/'+Slonik.config.get('lang')+'/'+Slonik.config.get('lang')+'.json')
);