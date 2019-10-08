let table = null,
	template_url = `/mapi/model/list`;
getMaster(template_url);

function getMaster(url) {
	table = $("#list").DataTable({
		destroy: true,
		ajax: {
	        url: url,
		    	dataSrc: function ( json ) {
            return json;
          }
	    },
	    columns: [{
				"title": "性別",
				"data": "sex"
			}, {
				"title": "年齡",
				"data": "age"
	    }, {
				"title": "圖檔",
				"data": "photo"
			}, {
	    	"title": "功能"
	    }],
	    columnDefs: [{
	    	targets: 0,
	    	className: 'dt-body-center',
	    	width: "10%",
	    	render: function ( data, type, row ) {
	    		return data === 'F'?'女':'男';
	    	}
	    }, {
	    	targets: 1,
	    	className: 'dt-body-center',
	    	width: "10%"
	    }, {
	    	targets: -2,
	    	className: 'dt-body-center',
	    	width: "30%",
	    	render: function ( data, type, row ) {
	    		return `<img src="/photo/model/${ data }" alt="${ data }" class="preview" style="display: inline;">`;
	    	}
	    }, {
	    	targets: -1,
	    	className: 'dt-body-center',
	    	width: "10%",
	    	render: function ( data, type, row ) {
	    		let btn_edit = '<button type="button" class="btn_edit btn btn-primary btn-wide">修改</button>',
	    			btn_delete = '<button type="button" class="btn_delete btn btn-alert btn-wide">刪除</button>';
            	return `<div class="btn-row">${ btn_edit }<br><br>${ btn_delete }</div>`;
            }
	    }]
	});
}

$('body').on('click', 'button.btn_delete', function() {
  var row = $(this).closest("tr");
  var data = $("#list").DataTable().row(row).data();

	message_confirm("確認刪除", `是否刪除 ${ data.model_id }?`, function(){ 
		$.ajax({
			url: '/mapi/model', // point to server-side controller method
			dataType: 'text', // what to expect back from the server
			data: data,
			type: 'DELETE',	    
			success: function (response) {
				let res = JSON.parse(response);
				message(res.result);
				table.ajax.reload();
			},
			error: function (response) {
				console.log('error:'+JSON.stringify(response));
			}
		});
	})
});

$('body').on('click', 'button.btn_edit', function() {
  var row = $(this).closest("tr");
  var data = $("#list").DataTable().row(row).data();

  $('#form_update input:text[name="sex"]').val(data.sex);
  $('#form_update input:text[name="age"]').val(data.age);
  $('#form_update input:hidden[name="new_photo"]').val(data.photo);
  $('#form_update input:hidden[name="remove_photo"]').val(data.photo);
  $('#form_update input:hidden[name="model_id"]').val(data.model_id);

  $('#dlg_update').dialog({
    title: "更新資料",
    modal: true,
    width: 400,
    open: function(event, ui) {
      $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
    },
    buttons: [{
    	text: "確認修改",
    	click: function() {
        btn_edit_click(()=>{$(this).dialog("close");});
      }
    }, {
      text: "取消",
      click: function() {
          $(this).dialog("close");
      }
    }]
	});
});

$('body').on('click', 'button.btn_insert', function() {
	formReset();

  $('#dlg_update').dialog({
    title: "新增資料",
    modal: true,
    width: 400,
    open: function(event, ui) {
      $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
    },
    buttons: [{
    	text: "確認新增",
    	click: function() {
        btn_insert_click(()=>{$(this).dialog("close");});
      }
    }, {
      text: "取消",
      click: function() {
        $(this).dialog("close");
      }
    }]
	});
});

function btn_edit_click(cb){
	let sex = $( "input:text[name='sex']").val(),
		age = $( "input:text[name='age']").val(),
		photo = $( "input:hidden[name='new_photo']").val(),
		remove = $( "input:hidden[name='remove_photo']").val(),
		model_id = $( "input:hidden[name='model_id']").val();

	if( sex == "" ){
		message("請輸入性別");
	} else if( age == "" ){
		message("請輸入年齡");
	} else {
		let data = {
			"sex": sex, 
			"age": age, 
			"photo": photo,
			"remove": remove,
			"model_id": model_id
		};

		$.ajax({
		    url: '/mapi/model',
		    type: 'PUT',
		    dataType: 'text',
		    data: data,
		    success: function(response) {
	        let res = JSON.parse(response);
					message(res.result);
					table.ajax.reload();
					$('#dlg_update').dialog("close");
					formReset();
					cb();
		    }
		});
	}
}

function btn_insert_click(cb){
	let sex = $( "input:text[name='sex']").val(),
		age = $( "input:text[name='age']").val(),
		check_photo = $( "input:file[name='photo']").val(),
		photo = $( "input:hidden[name='new_photo']").val();

	if( sex == "" ){
		message("請輸入性別");
	} else if( age == "" ){
		message("請輸入年齡");
	} else if( check_photo == "" ){
		message("請挑選相片");
	} else {
		let data = {
			"sex": sex, 
			"age": age,
			"photo": photo
		};

		$.ajax({
		    url: '/mapi/model',
		    type: 'POST',
		    dataType: 'text',
		    data: data,
		    success: function(response) {
	        let res = JSON.parse(response);
					message(res.result);
					table.ajax.reload();
					$('#dlg_update').dialog("close");
					formReset();
					cb();
		    }
		});
	}
}

$('#upd_photo').change(function(){
	var file_data = $('#upd_photo').prop('files')[0];
	if (!file_data) {
		return;
	}
	var form_data = new FormData();
	form_data.append('photo', file_data);

	$.ajax({
		url: '/photo/preview', // point to server-side controller method
		type: 'POST',
		dataType: 'text', // what to expect back from the server
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		success: function (response) {
			console.log(response);
			// $('.btn-primary').prop('disabled', false);
			$('#preview')
				.attr('src', `/photo/preview?name=${ response }&kind=model`)
				.show();

			$( "input:hidden[name='new_photo']").val(response);
		},
		error: function (response) {
			// $('.btn-primary').prop('disabled', true);
			// $('#msg').html(`<font color='red'>${ response.responseText }</font>`); // display error response from the server
		}
	});
})

function formReset() {
	document.getElementById("form_update").reset();
	$('#preview').attr('src','').hide()
}