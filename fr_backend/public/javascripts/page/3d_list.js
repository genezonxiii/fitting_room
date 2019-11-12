let table = null,
	template_url = `/mapi/3d`;
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
			"title": "名稱",
			"data": "photo_name"
		}, {
			"title": "圖檔1",
			"data": "photo1"
		}, {
			"title": "圖檔2",
			"data": "photo2"
		}, {
			"title": "圖檔3",
			"data": "photo3"
		}, {
			"title": "圖檔4",
			"data": "photo4"
		}, {
			"title": "圖檔5",
			"data": "photo5"
		}, {
			"title": "圖檔6",
			"data": "photo6"
		}, {
			"title": "合成後3D",
			"data": "photo3d"
		}, {
			"title": "功能"
		}],
    columnDefs: [{
    	targets: 0,
    	width: "10%"
    }, {
    	targets: [1, 2, 3, 4, 5, 6, 7],
    	width: "10%",
    	render: function ( data, type, row ) {
    		return data?`<img src="/photo/3d/${ data }" alt="${ data }" class="preview" style="display: inline;">`:'';
    	}
    }, {
    	targets: -1,
    	width: "10%",
    	render: function ( data, type, row ) {
    		let btn_edit = '<button type="button" class="btn_edit btn btn-primary btn-wide">修改</button>',
    			btn_delete = '<button type="button" class="btn_delete btn btn-alert btn-wide">刪除</button>';
      	return `<div class="btn-row">${ btn_edit }<br><br>${ btn_delete }</div>`;
      }
    }, {
    	targets: '_all',
    	className: 'dt-body-center'
    }]
	});
}

$('body').on('click', 'button.btn_delete', function() {
  var row = $(this).closest("tr");
  var data = $("#list").DataTable().row(row).data();

	message_confirm("確認刪除", `是否刪除 ${ data.photo_name }?`, function(){ 
		$.ajax({
			url: '/mapi/3d',
			type: 'DELETE',
			dataType: 'text',
			data: data,
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

  $('#form_update input:text[name="photo_name"]').val(data.photo_name);
  $('#form_update input:hidden[name="photo_id"]').val(data.id);

	for(var i=1; i<7; i++) {
  	$(`#form_update input:hidden[name="new_photo${i}"]`).val(data[`photo${i}`]);
  	$(`#form_update input:hidden[name="remove_photo${i}"]`).val(data[`photo${i}`]);
  }
  
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
	let photo_name = $( "input:text[name='photo_name']" ).val(),
		photo_id = $( "input:hidden[name='photo_id']" ).val();
	
	let remove = new Array(7),
		photo = new Array(7);

	for (var i=1; i<7; i++){
		photo[i] = $( `input:hidden[name='new_photo${i}']` ).val();
		remove[i] = $( `input:hidden[name='remove_photo${i}']` ).val();
	}

	// if( sex == "" ){
	// 	message("請選擇性別");
	// } else if( age == "" ){
	// 	message("請輸入年齡");
	// } else if( persona == "" ){
	// 	message("請選擇persona");
	// } else {
		let data = {
			"photo_id": photo_id,
			"photo_name": photo_name
		};

		for (var i=1; i<7; i++){
			data[`photo${i}`] = photo[i];
			data[`remove${i}`] = remove[i];
		}

		$.ajax({
		    url: '/mapi/3d',
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
	// }
}

function btn_insert_click(cb){
	let photo_name = $( "input:text[name='photo_name']" ).val();
	let check_photo = new Array(7),
		photo = new Array(7);

	for (var i=1; i<7; i++){
		check_photo[i] = $( `input:file[name='photo${i}']` ).val();
		photo[i] = $( `input:hidden[name='new_photo${i}']` ).val();
	}

	// if( sex == "" ){
	// 	message("請選擇性別");
	// } else if( age == "" ){
	// 	message("請輸入年齡");
	// } else if( persona == "" ){
	// 	message("請選擇persona");
	// } else if( check_photo == "" ){
	// 	message("請挑選相片");
	// } else {
		let data = {
			"photo_name": photo_name
		};

		for (var i=1; i<7; i++){
			data[`photo${i}`] = photo[i];
		}

		$.ajax({
		    url: '/mapi/3d',
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
	// }
}

$("input:file[name^='photo']").change(function() {
	const id = $(this).attr('id'),
		name = $(this).attr('name');
	var file_data = $(`#${id}`).prop('files')[0];
	if (!file_data) {
		return;
	}
	var form_data = new FormData();
	form_data.append('photo', file_data);

	$.ajax({
		url: '/photo/preview',
		type: 'POST',
		dataType: 'text',
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		success: function (response) {
			// $('.btn-primary').prop('disabled', false);
			$(`#preview_${name}`)
				.attr('src', `/photo/preview?name=${ response }&kind=model`)
				.show();

			$( `input:hidden[name='new_${name}']` ).val(response);
		},
		error: function (response) {
		}
	});
})

function formReset() {
	document.getElementById("form_update").reset();
	$(`img[id^=preview]`).attr('src', '').hide()
}
