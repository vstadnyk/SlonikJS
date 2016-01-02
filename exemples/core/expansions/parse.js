replace:/[^A-Za-z_;]/g,
filter:/\{\%\s*[a-zA-Z0-9._/:-]+?\s*\%\}/g,
element:function(e,obj){
	var node,ind,index,p,
		obj=obj||Slonik,
		walk=document.createTreeWalker(e.get(0),NodeFilter.SHOW_TEXT,null,false);
		
		while(node=walk.nextNode()){
			if(!node.nodeValue.match(this.filter))continue;
				ind=node.nodeValue.replace(this.replace,'');
				p=node.parentNode.childNodes;
				index=Array.prototype.indexOf.call(node.parentNode.childNodes,node);
				node.parentNode.lang=[index,ind];
				obj.lang&&obj.lang.get(ind)?node.nodeValue=obj.lang.get(ind):false
		};
	return e;
},
string:function(string,obj){
	var ind,obj=obj||Slonik;
	if(!string.match(this.filter))return string;
	
	ind=string.replace(this.replace,'');
	return obj.lang&&obj.lang.get(ind)?obj.lang.get(ind):false;
}