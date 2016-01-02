render:{
	input:function(e){
		e.each(function(){
			var p;
			e.data.elements.set(this.name,$(this));
			if(this.dataset.parsed)return;
			p=this.required?'* ':'';
			p+=Slonik.parse.string(this.placeholder)||'error lang';
			this.placeholder=p;
			this.dataset.parsed=true;
		})
	}
},
events:{
	click:{
		status:function(e){
			$(this).trigger({type:'hide',speed:10})
		}
	},
	change:{
		input:function(e){
			$(this).removeClass('error')
		}
	},
	reset:{
		input:function(e){
			this.type!=='hidden'?$(this).val(''):false
		},
		status:function(e){
			$(this).removeClass('done').removeClass('error').removeClass('success').text('')
		}
	},
	hide:{
		status:function(e){
			setTimeout(function(){
				$(e.target).fadeOut(300,function(){
					$(this).trigger('reset')
				})
			},e.speed);
		}
	},
	error:{
		input:function(e){
			$(this).addClass('error')
		},
		status:function(e){
			$(this).addClass('error').trigger({type:'hide',speed:1000})
		}
	},
	done:{
		status:function(e){
			$(this).addClass('done')
		}
	},
	success:{
		status:function(e){
			$(this).addClass('success').trigger({type:'hide',speed:3000})
		}
	},
	submit:{
		form:function(e){
			var es=e.data.elements,
				$status=e.data.elements.status;
			e.preventDefault();
			
			Slonik.request.post('/assets/slonik/php/joomla/send_email.php',{
				data:e.data.buildData(),
				beforeSend:function(){
					$status.show()
				}
			}).done(function(response){
				var i;
				response=JSON.parse(response);
				$status.trigger('done').text(Slonik.parse.string(response.text));
				
				if(!response.send){
					$status.trigger('error');
					for(i in response.fields){
						es.get(response.fields[i]).trigger('error')
					}
				}else{
					$status.trigger('success');
					e.data.elements.input.trigger('reset');
				}
			});
		}
	}
},
buildData:function(){
	var data={
		type:this.option.type
	};
	this.elements.input.each(function(){
		data[this.name]={
			name:this.name,
			value:this.value,
			required:this.required?true:false			
		}
	});
	
	return data
},
init:function(e,option){
	var $status=e.find('.status').length?e.find('.status'):$('<div/>',{'class':'status'}).text(Slonik.lang.get('loading')).appendTo(e);
	
	this.option=option;
	
	this.elements.extend({
		form:e,
		input:e.find('[name]'),
		status:$status,
	},this);
	
	return this.elements.form;
}