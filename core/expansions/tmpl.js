lib:Object.create(Object.prototype),
html:function(tmpl){
	return Slonik.request.get(Slonik.config.get('tmplDir')+tmpl,{
		async:false,
		contentType:'charset=UTF-8'
	}).responseText
},
get:function(tmpl){
	!this.lib[tmpl]?this.lib[tmpl]=$('<div/>').append(this.html(tmpl)).children():false;
	
	return this.lib[tmpl];
}