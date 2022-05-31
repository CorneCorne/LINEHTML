// 現在のアカウント
var speaker_id = 0;

var sid_max = 1;
var tid_max = 1;

var title = "";

date = "";

/*
line	: config	: >_-_<title>_-_<speaker_id>_-_<
>splitter_config_account_and_message<
line	: account	: >_-_<speaker_id>_-_<user_name>_-_<speaker_name>_-_<speaker_picture_name>_-_<
>splitter_config_account_and_message<
line	: message	: >_-_<speaker_id>_-_<talk_id>_-_<message>_-_<
*/


// document.getElementsByClassName('line__title')[0].innerHTML

var message_str = "";

sid2user_name = {};
user_name2sid = {};
sid2speaker_name = {};
sid2pic_name = {};
tid2sid = {};
tid2mes = {};


open_file = function(){
	const reader = new FileReader();
	reader.onload = function() {
		// 内容表示
		// alert(reader.result);
		// 内容をmessageに読み込む
		load_data(reader.result);
	};

	const input = document.createElement('input');
	input.type = 'file';
	// input.accept = '.txt, text/plain';
	input.onchange = function(event) {
		reader.readAsText(event.target.files[0]);
	};
	input.click();
}

load_data = function(text_data){
	sid2user_name = {};
	user_name2sid = {};
	sid2speaker_name = {};
	sid2pic_name = {};
	tid2sid = {};
	tid2mes = {};

	add_html = '';
	split_data = text_data.split('>splitter_config_account_and_message<');
	config_str = split_data[0];
	account_str = split_data[1];
	message_str = split_data[2];

	// 設定の処理
	split_config = config_str.match(/>_-_<(.*)>_-_<(.*)>_-_</);
	temp_title = split_config[1];
	document.getElementsByClassName('line__title')[0].innerText = temp_title;
	title = temp_title;
	speaker_id = split_config[2]*1;

	//アカウントを全て消す
	element = document.getElementsByClassName('user_list')[0];
	while (element.firstChild) element.removeChild(element.firstChild);
	// アカウントの処理
	split_account = account_str.split('\n');
	for(var i = 0;i < split_account.length;i++){
		if(split_account[i] == ""){
			continue;
		}
		var temp = split_account[i].match(/>_-_<(.*)>_-_<(.*)>_-_<(.*)>_-_<(.*)>_-_</);
		temp_speaker_id = temp[1]*1;
		temp_user_name = temp[2];
		temp_speaker_name = temp[3];
		temp_speaker_picture_name = temp[4];
		sid2user_name[temp_speaker_id] = temp_user_name;
		user_name2sid[temp_user_name] = temp_speaker_id;
		sid2speaker_name[temp_speaker_id] = temp_speaker_name;
		sid2pic_name[temp_speaker_id] = temp_speaker_picture_name;

		display_user(temp_speaker_id,temp_user_name,temp_speaker_name,temp_speaker_picture_name);

		if(sid_max < temp_speaker_id){
			sid_max = temp_speaker_id;
		}
	}

	document.getElementById(speaker_id).parentNode.style.backgroundColor = '#00d0d0';

	// メッセージの処理
	split_message = message_str.split('\n');
	for(var i = 0;i < split_message.length;i++){
		if(split_message[i] == ""){
			continue;
		}
		var temp = split_message[i].match(/>_-_<(.*)>_-_<(.*)>_-_<(.*)>_-_</);
		temp_speaker_id = temp[1]*1;
		temp_talk_id = temp[2]*1;
		temp_message = temp[3];

		tid2sid[temp_talk_id] = temp_speaker_id;
		tid2mes[temp_talk_id] = temp_message;

		if(tid_max < temp_talk_id){
			tid_max = temp_talk_id;
		}
	}

	load_message();

	sid_max++;
	tid_max++;
}


save_data = function(){

	var all_data = ">_-_<"+title+">_-_<"+speaker_id+">_-_<\n";
	all_data += ">splitter_config_account_and_message<\n";

	sid_list = Object.keys(sid2user_name);
	for(var i = 0;i < sid_list.length;i++){
		sid = sid_list[i];
		all_data += ">_-_<"+sid+">_-_<"+sid2user_name[sid]+">_-_<"+sid2speaker_name[sid]+">_-_<"+sid2pic_name[sid]+">_-_<\n";
	}

	all_data += ">splitter_config_account_and_message<\n";

	tid_list = Object.keys(tid2sid);
	for(var i = 0;i < tid_list.length;i++){
		tid = tid_list[i];
		//>_-_<speaker_id>_-_<talk_id>_-_<message>_-_<
		all_data += ">_-_<"+tid2sid[tid]+">_-_<"+tid+">_-_<"+tid2mes[tid]+">_-_<\n";
	}

	var a = document.createElement('a');
	a.href = 'data:text/plain,' + encodeURIComponent(all_data);
	if(title == ""){
		a.download = 'chat.txt';
	}else{
		a.download = title;
	}

	a.click();
}

load_message = function(){
	// 全文削除
	element = document.getElementsByClassName('line__contents scroll')[0];
	while (element.firstChild) element.removeChild(element.firstChild);

	// speaker_idを元に、LINEテキストを表示する
	tid_list = Object.keys(tid2sid);
	for(var i = 0;i < tid_list.length;i++){
		tid = tid_list[i];
		// console.log("tid"+tid);
		// console.log("真偽" + tid2sid[tid] == speaker_id);
		// console.log("sid"+speaker_id);
		// console.log("mes" + tid2mes[tid]);
		display_message(tid2sid[tid] == speaker_id,tid2sid[tid],tid,tid2mes[tid]);

	}
	h = document.getElementsByClassName("line__contents scroll")[0].scrollHeight;
	document.getElementsByClassName("line__contents scroll")[0].scrollBy(0,h);

}


display_user = function(sid,u_name,s_name,pic_name){
	html_text = '<button class="user" type="button" onclick="click_user(this)">' +
				'<div class="user_icon"> <img src="icon/'+ pic_name+ '" /> </div>' +
				'<div class="user_info" id=' + sid + '>' +
				'<div class="user_name">' +
				u_name +
				'</div>'+
				'<div class="speaker_name">'+
				s_name +
				'</div></div></button>';
	element = document.getElementsByClassName('user_list')[0];
	element.insertAdjacentHTML('beforeend',html_text);
}

display_message = function(is_speaker,sid,tid,message){
	if(is_speaker){
		html_text = '<div class="line__right" id='+tid+' onclick="display_delete(this)"><div class="text">'+message+'</div>'+
					'<a href="javascript:void(0);" onclick="delete_message(this)" class="delete">削除</a>'+
					'</div>';
		chat.insertAdjacentHTML('beforeend',html_text);
	}else if(sid == -1){
		html_text = '<div class="line__center" id='+tid+' onclick="display_delete(this)"><span class="date">'+message+'</span>'+
					'<a href="javascript:void(0);" onclick="delete_message(this)" class="delete">削除</a>'+
					'</div>';
		chat.insertAdjacentHTML('beforeend',html_text);
	}else{
		s_name = sid2speaker_name[sid];
		pic_name = sid2pic_name[sid];
		html_text = '<div class="line__left" id='+tid+' onclick="display_delete(this)"> ' +
					'<figure>' +
					'<img src="icon/' + pic_name + '" />'+
					'</figure>'+
					'<div class="line__left-text">' +
					'<div class="name">' + s_name + '</div>' +
					'<div class="text">' + message + '</div>' +
					'</div>' +
					'<a href="javascript:void(0);" onclick="delete_message(this)" class="delete">削除</a>'+
					'</div>';
		chat.insertAdjacentHTML('beforeend',html_text);
	}
}

display_delete = function(e){
	//console.log(e.getElementsByTagName('a')[0].style.display);
	if(e.getElementsByTagName('a')[0].style.display == "inline"){
		e.getElementsByTagName('a')[0].style.display = "none";
	}else{
		e.getElementsByTagName('a')[0].style.display = "inline";
	}
}

delete_message = function(e){
	element = e.parentNode;
	//console.log(e.parentNode.id);
	delete tid2sid[element.id];
	delete tid2mes[element.id];
	element.parentNode.removeChild(element);
}




send_message = function(){
	//console.log("func send_message");
	one_message = document.getElementsByClassName('bms_send_message')[0].value;
	document.getElementsByClassName('bms_send_message')[0].value = "";
	// console.log(one_message);

	split_one_message = one_message.split(' ');

	u_name_array = Object.keys(user_name2sid);
	for(var i = 0;i < u_name_array.length;i++){
		if(split_one_message[0] == u_name_array[i]){
			sid = user_name2sid[split_one_message[0]];
			one_message = one_message.replace(/\n/g, '<br>');
			one_message = one_message.replace(split_one_message[0] + " ", "");
			display_message(false,sid,tid_max,one_message);
			tid2sid[tid_max] = sid;
			tid2mes[tid_max] = one_message;
			tid_max++;
			return;
		}
	}

	if(split_one_message[0] == "help"){
		help_message = "[このメッセージは保存されません]\n"
						+"set_title title タイトルを設定します\n"
						+"clear_all 全メッセージを削除します\n"
						+"reg_user speaker_name;;;speaker_picture_name ユーザーを登録します\n"
						+"\n";
		help_message = help_message.replace(/\n/g, '<br>');
		display_message(true,0,0,help_message);
	}else if(split_one_message[0] == "set_title"){
		// タイトルを設定する
		console.log("set_title");
		document.getElementsByClassName('line__title')[0].innerHTML = one_message.replace("set_title ","");
		title = one_message.replace("set_title ","");
	}else if(split_one_message[0] == "clear_all"){
		element = document.getElementsByClassName('line__contents scroll')[0];
		while (element.firstChild) element.removeChild(element.firstChild);
		tid2sid = {};
		tid2mes = {};
	}else if(split_one_message[0] == "reg_user"){
		// reg_user koisi;;;こいし;;;こいし.png
		// reg_user satori;;;さとり;;;さとり.png
		one_message = one_message.replace("reg_user ","");
		res = one_message.split(";;;");
		temp_user_name = res[0];
		temp_speaker_name = res[1];
		temp_speaker_picture_name = res[2];
		display_user(sid_max,temp_user_name,temp_speaker_name,temp_speaker_picture_name);

		sid2user_name[sid_max] = temp_user_name;
		user_name2sid[temp_user_name] = sid_max;
		sid2speaker_name[sid_max] = temp_speaker_name;
		sid2pic_name[sid_max] = temp_speaker_picture_name;
		sid_max++;

	}else if(split_one_message[0] == "change_user"){
		u_name_array = Object.keys(user_name2sid);
		for(var i = 0;i < u_name_array.length;i++){
			if(split_one_message[1] == u_name_array[i]){
				console.log(split_one_message[1]);
				speaker_id = user_name2sid[split_one_message[1]];
				break;
			}
		}
		load_message();
	}else if(split_one_message[0] == "center"){
		one_message = one_message.replace(/\n/g, '<br>');
		one_message = one_message.replace("center ", "");
		display_message(false,-1,tid_max,one_message);
		tid2sid[tid_max] = -1;
		tid2mes[tid_max] = one_message;
		tid_max++;

	}else{
		one_message = one_message.replace(/\n/g, '<br>');
		display_message(true,speaker_id,tid_max,one_message);
		tid2sid[tid_max] = speaker_id;
		tid2mes[tid_max] = one_message;
		tid_max++;
	}



	h = document.getElementsByClassName("line__contents scroll")[0].scrollHeight;
	document.getElementsByClassName("line__contents scroll")[0].scrollBy(0,h);
}

click_user = function(e){
	temp_speaker_id = e.getElementsByClassName('user_info')[0].id*1;
	if(speaker_id == temp_speaker_id){
		return;
	}
	speaker_id = temp_speaker_id;

	//e : element
	elements = document.getElementsByClassName('user');
	for(var i = 0;i < elements.length;i++){
		elements[i].style.backgroundColor = '#dddddd';
	}
	e.style.backgroundColor = '#00d0d0';

	load_message();
}

