Slonik.elements.extend({
	slider:'#slider',
	tile:'.tile li',
	gallery:'.gallery-items img:not(a img)',
	calculator:'#calc-table',
	bathrooms:'#bathrooms .bathroom',
	contactsForm:'#contacts-form',
	menu:'header nav',
	tileMenu:'#top ul',
	middle:'#middle article:not(.steps)',
	titles:'#middle .title, #bottom .title',
	bottom:'#bottom article',
	contacts:'.contacts-info'
},Slonik);

Slonik.router.table.extend({
	module:{
		form:function(tmpl,router){
			var $form=Slonik.parse.element(Slonik.tmpl.get(tmpl)),
				title=Slonik.lang.get('form_'+tmpl.split('.')[0]+'_title');
			Slonik.module('modal',false,{
				title:title,
				content:true,
				done:function(modal){
					router.current=modal.elements.body;
					modal.elements.content.append($form);
					Slonik.module('form',$form,{
						type:title
					});
					return $form;
				}
			});
		},
		map:function(option){
			Slonik.module('modal',false,{
				title:Slonik.lang.get('map_title'),
				content:true,
				done:function(modal){
					return Slonik.module('gmap',
						modal.elements.content.append(
							$('<div/>',{'id':'map'})
								.width($(window).width()/10*9)
								.height(($(window).height()-modal.elements.head.height())/10*7)
						),{
						lat:option.split(',')[0],
						lng:option.split(',')[1]
						})
				},
				close:function(){
					$('head script').filter(function(){
						return this.src.match(/googleapis/gi)
					}).remove();
					google=null;
					__e3_=null;
					_xdc_=null;
				}
			});
		},
		gallery:function(o,router){
			Slonik.module('gallery',o.src,o)
		},
		modal:function(query){
			Slonik.module('modal',false,{
				title:Slonik.lang.get('view_estimate_title'),
				content:true,
				done:function(modal){
					return modal.elements.content.append($(query.replace(/\+/i,' ')).clone().width($(window).width()/10*8))
				}
			})
		}
	}
});

Slonik.expand('tmpl');
Slonik.expand('parse');
Slonik.router.init();
Slonik.extend({
	render:{
  		menu:function(e){
			Slonik.ie?$('head').append($('<link/>',{
				'href':'/templates/vespol/css/ie.css',
				'rel':'stylesheet'
			})):false;
			
			Slonik.module('menu',e);
		},
		tileMenu:function(e){
			Slonik.module('tileMenu',e);
		},
		slider:function(e){
			Slonik.module('slider',e);
		},
		gallery:function(e){
		 	e.parent().is('p')?e.unwrap('p'):false;
			
			for(var i in e.get()){
				Object.assign(new Image(),{
					src:e.get(i).src,
					data:e.data,
					i:parseInt(i),
					onload:e.data.events.preload.gallery
				})
			}
		},
		calculator:function(e){
			Slonik.module('calculator',e,{
				price:e.find('td:nth-child(3):not(.calc-table-head td:nth-child(3))'),
				count:e.find('td:nth-child(4):not(.calc-table-head td:nth-child(4))'),
				sum:e.find('td:nth-child(5):not(.calc-table-head td:nth-child(5))'),
				result:$('#count-calc-table span')
			})
		},
		bathrooms:function(e){
			Slonik.module('bathrooms',e)
		},
		contactsForm:function(e){
			Slonik.module('form',Slonik.parse.element(Slonik.tmpl.get('feedback.html')).appendTo(e),{
				type:Slonik.lang.get('form_order_title')
			});
		}
	},
	events:{
		adapt:{
 			tile:function(e){
				var i,ww=$(this).parent().width();
				i=Math.ceil(ww/480);
				$(this).removeAttr('style').width((ww/i)-45);
				$(this).index()%i==0?$(this).css({'clear':'left'}):false
			},
			middle:function(e){
				var ww=$(window).width();
				$(this).width(ww>=880?'50%':'100%');
			},
			titles:function(e){
				e.textFit(470,42);
			},
			bottom:function(e){
				var w,ww=($(window).width()/10)*9,tmp=new Image();
				if(!$(this).find('img').length)return;
				tmp.src=$(this).find('img:eq(0)').get(0).src;
				tmp.onload=function(){
					w=ww-this.width+30;
					w<=340?w=ww:false;
					$(e.target).find('.content').width(w).next().removeAttr('class').addClass(w==ww?'relative':'absolute');
				}
			},
			contacts:function(e){
				$(this).removeClass('small');
				$(this).width()/2<=345?$(this).addClass('small'):false;
			}
		},
		preload:{
			gallery:function(e){
				$(this.data.elements.get('gallery').get(this.i)).wrap($('<a/>',{
					'class':'zoom gallery-item',
					'href':'#module=gallery&'+JSON.stringify({
						src:this.src.replace(/thumbnails\/images\//gi,'').replace('-'+this.width+'x'+this.height,''),
						index:this.i,
						container:'.gallery-items'
					})
				}))
			}
		}
	}
});