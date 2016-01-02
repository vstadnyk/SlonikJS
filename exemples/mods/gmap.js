events:{
	adapt:{
		map:function(e){
			var ww=$(window).width()/10*9,hw=$(this).prev().width();
			$(this).width(ww>=hw?ww:hw).height($(window).height()/10*7);
			e.data.config.map?e.data.config.map.setCenter(e.data.config.latlng):false
		}
	}
},
build:function(){
	var map=new google.maps.Map(
		this.module.elements.map.get(0),
		Object.assign({},this.module.config)
	),
		//geocoder=new google.maps.Geocoder(),
		latlng=new google.maps.LatLng(
			this.module.config.lat,
			this.module.config.lng
		),
		marker=new google.maps.Marker({position:latlng,map:map});
	
	this.module.config.set('map',map).set('latlng',latlng);
	this.module.elements.map.trigger('adapt');
	
	this.module.build.module=this.module;
},
config:Object.create(protoJSON),
init:function(e,option){
	var i,query=[];

	this.config.extend(option);
	
	this.elements.extend({
		map:e
	},this);
	
	for(i in this.config.query){
		query.push(i+'='+this.config.query[i])
	}
	
	Slonik.request.get('http://maps.googleapis.com/maps/api/js?'+query.join('&'),{
		dataType:'script',
		async:false,
		cache:true,
		module:this
	}).done(this.build);
	
	return true;
}