//Object.assign polyfill
if(!Object.assign){
	Object.defineProperty(Object,'assign',{
		enumerable:false,
		configurable:true,
		writable:true,
		value:function(target,firstSource){
			if(target===undefined||target===null){
				throw new TypeError('Cannot convert first argument to object')
			}

			var to=Object(target);
			
			for(var i=1;i<arguments.length;i++){
				var nextSource=arguments[i];
				if(nextSource===undefined||nextSource===null){continue}

				var keysArray=Object.keys(Object(nextSource));
				for(var nextIndex=0,len=keysArray.length;nextIndex<len;nextIndex++){
					var nextKey=keysArray[nextIndex];
					var desc=Object.getOwnPropertyDescriptor(nextSource,nextKey);
					if(desc!==undefined&&desc.enumerable){
						to[nextKey]=nextSource[nextKey]
					}
				}
			}
			return to
		}
	});
}

//Array.prototype.find polyfill
if(!Array.prototype.find){
	Array.prototype.find=function(predicate){
		if(this==null){
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if(typeof predicate!=='function'){
			throw new TypeError('predicate must be a function');
		}
		
		var list=Object(this);
		var length=list.length>>>0;
		var thisArg=arguments[1];
		var value;

		for(var i=0;i<length;i++){
			value=list[i];
			if(predicate.call(thisArg,value,i,list)){
				return value;
			}
		}
		return undefined;
	};
}

//Object.create polyfill
if(typeof Object.create!='function'){
  Object.create=(function(){
    function Temp(){}
    var hasOwn=Object.prototype.hasOwnProperty;
    return function(O){
      if(typeof O!='object'){
        throw TypeError('Object prototype may only be an Object or null');
      }
      Temp.prototype=O;
      var obj=new Temp();
      Temp.prototype=null;
      if(arguments.length>1){
        var Properties=Object(arguments[1]);
        for(var prop in Properties){
          if (hasOwn.call(Properties,prop)){
            obj[prop]=Properties[prop];
          }
        }
      }
      return obj;
    };
  })();
}

if(!document.querySelectorAll){
  document.querySelectorAll=function(selectors){
    var style=document.createElement('style'),elements=[],element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa=[];
    style.styleSheet.cssText=selectors+'{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0,0);
    style.parentNode.removeChild(style);

    while (document._qsa.length){
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa=null;
    return elements;
  };
}

if(!document.querySelector){
  document.querySelector=function(selectors){
    var elements=document.querySelectorAll(selectors);
    return (elements.length)?elements[0]:null;
  };
}

if(!window.JSON){
  window.JSON={
    parse:function(sJSON){return eval('('+sJSON+')')},
    stringify:function(vContent){
      if(vContent instanceof Object){
        var sOutput='';
        if (vContent.constructor===Array){
          for(var nId=0;nId<vContent.length;sOutput+=this.stringify(vContent[nId])+',',nId++);
          return'['+sOutput.substr(0,sOutput.length-1)+']';
        }
        if(vContent.toString!==Object.prototype.toString){
          return'"'+vContent.toString().replace(/"/g, '\\$&')+ '"';
        }
        for(var sProp in vContent){
          sOutput+='"'+sProp.replace(/"/g,'\\$&')+'":'+this.stringify(vContent[sProp])+',';
        }
        return'{'+sOutput.substr(0,sOutput.length-1)+'}';
     }
     return typeof vContent==='string'?'"'+vContent.replace(/"/g,'\\$&')+'"':String(vContent);
    }
  };
}