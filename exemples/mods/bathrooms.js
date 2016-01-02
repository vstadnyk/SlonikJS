lang:Object.create(protoJSON),
build:function(e){
	var i,$tmpl=Slonik.parse.element(Slonik.tmpl.get('bathrooms.html'),this).clone().insertBefore($(e).find('table:eq(0)'));
	
	for(i in $(e).find('table').get()){
		$tmpl.find('.price').eq(i).text($(e).find('table').eq(i).find('tr:last() td:last()').text()+' '+this.lang.get('currency'));
		$tmpl.find('.actions:eq('+i+') a:eq(0)').get(0).href+='.bathroom:eq('+$(e).index()+')+table:eq('+i+')';
	}
},
init:function(e){
	for(var i in e.get()){
		this.build(e.get(i))
	}
	
	return this;
}