(function(){
	ajax=window.ajax=(options)=>{
		function formParams(data){
			var arr=[];
			for(var prop in data)
			{
				arr.push(prop+"="+data[prop]);
			}
			return arr.join("&");
		}
		var _default={
			url:"",
			type:"GET",
			dataType:"json",
			async:true,
			data:null,
			success:null
		}
		for(var key in options){
			if(options.hasOwnProperty(key)){
				_default[key]=options[key];
			}
		}
		var xhr=null;
		var params=formParams(_default.data);
		//1.创建Ajax对象  处理兼容性
		if(window.XMLHttpRequest){
			xhr = new XMLHttpRequest();
		}else{
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		//连接
		if(_default.type==="GET"){
			if(_default.data){
				_default.url.indexOf("?")>=0 ? _default.url+="&":_default.url+="?";
				_default.url += "_="+Math.random();//清楚缓存
				//2.连接服务器
				xhr.open(_default.type,_default.url,_default.async);
				//3.发送请求
				xhr.send(null);
			}else{
				xhr.open(_default.type,_default.url,_default.async);
				xhr.send(null);
			}
		}else{
			xhr.open(_default.type,_default.url,_default.async);
			if(_default.dataType=="json"){
				xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
			}else{
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
			}
			xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
			var json=_default.data;
			xhr.send(json);
		}
		//4.接收返回
		xhr.onreadystatechange=()=>{
			if(xhr.readyState===4){
				if(xhr.status===200){
					if(_default.dataType==="json"){
						var data = xhr.responseText;
					    _default.success(data);
					   return;
					}
					_default.success(responseText)
				}
			}
		}
	}
})()
