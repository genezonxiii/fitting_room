let table = null,
	template_url = `/mapi/product/list`;
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
			"title": "類別",
			"data": "kind"
    }, {
			"title": "料號",
			"data": "c_product_id"
    }, {
			"title": "品名",
			"data": "product_name"
    }, {
			"title": "品牌",
			"data": "brand"
    }, {
			"title": "風格",
			"data": "style"
    }, {
			"title": "說明",
			"data": "desc"
    }, {
			"title": "穿搭圖",
			"data": "photo"
		}, {
			"title": "展示圖",
			"data": "thumbnail"
		}, {
			"title": "3D圖",
			"data": "photo3d"
		}, {
    	"title": "功能"
    }],
    columnDefs: [{
    	targets: 0,
    	className: 'dt-body-center',
    	// width: "5%",
    	render: function ( data, type, row ) {
    		return data === 'F'?'女':'男';
    	}
    }, {
     	targets: 1,
    	className: 'dt-body-center',
    	// width: "5%",
    	render: function ( data, type, row ) {
				switch(data) {
					case "cloth": 
						return "上衣";
						break;
					case "pants": 
						return "褲/裙"; 
						break;
					case "dress": 
						return "洋裝"; 
						break;
					case "shoes": 
						return "鞋子"; 
						break;
					default:  
						return "";
				}
    	}
    }, {
    	targets: 3,
    	className: 'dt-body-center',
    	width: "10%"
    }, {
    	targets: -3,
    	className: 'dt-body-center',
    	width: "20%"
    }, {
    	targets: -4,
    	className: 'dt-body-center',
    	width: "10%",
    	render: function ( data, type, row ) {
    		return data?`<img src="/photo/${ row.kind }/${ data }" alt="${ data }" class="preview" style="display: inline;">`:'';
    	}
    }, {
    	targets: -3,
    	className: 'dt-body-center',
    	width: "10%",
    	render: function ( data, type, row ) {
    		return data?`<img src="/photo/${ row.kind }/thumbnail/${ data }" alt="${ data }" class="preview" style="display: inline;">`:'';
    	}
    }, {
    	targets: -2,
    	className: 'dt-body-center',
    	width: "10%",
    	render: function ( data, type, row ) {
    		return data?`<img src="/photo/${ row.kind }/3d/${ data }" alt="${ data }" class="preview" style="display: inline;">`:'';
    	}
    }, {
    	targets: -1,
    	className: 'dt-body-center',
    	width: "5%",
    	render: function ( data, type, row ) {
    		let btn_edit = '<button type="button" class="btn btn-primary btn_edit btn-wide">修改</button>',
  			btn_delete = '<button type="button" class="btn btn-alert btn_delete btn-wide">刪除</button>';
        	return `<div class="btn-row">${ btn_edit }<br><br>${ btn_delete }</div>`;
      }
    }]
	});
}

$('body').on('click', 'button.btn_delete', function() {
  var row = $(this).closest("tr");
  var data = $("#list").DataTable().row(row).data();

	message_confirm("確認刪除", `是否刪除料號 ${ data.c_product_id }?`, function(){ 
		$.ajax({
			url: '/mapi/product', // point to server-side controller method
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

  $('#form_update select[name="sex"]').val(data.sex);
  $('#form_update select[name="kind"]').val(data.kind);
  $('#form_update input:text[name="c_product_id"]').val(data.c_product_id);
  $('#form_update input:text[name="product_name"]').val(data.product_name);
  $('#form_update input:text[name="brand"]').val(data.brand);
  $('#form_update select[name="style"]').val(data.style);
  $('#form_update input:text[name="desc"]').val(data.desc);
  $('#form_update input:hidden[name="new_photo"]').val(data.photo);
  $('#form_update input:hidden[name="remove_photo"]').val(data.photo);
  $('#form_update input:hidden[name="new_thumbnail"]').val(data.thumbnail);
  $('#form_update input:hidden[name="remove_thumbnail"]').val(data.thumbnail);
  $('#form_update input:hidden[name="new_photo3d"]').val(data.photo3d);
  $('#form_update input:hidden[name="remove_photo3d"]').val(data.photo3d);
  $('#form_update input:hidden[name="product_id"]').val(data.product_id);

  $('#form_update select[name="kind"]').attr("disabled", true); 

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
	$('#form_update select[name="kind"]').attr("disabled", false); 
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
	let sex = $( "select[name='sex']").val(),
		kind = $( "select[name='kind']").val(),
		c_product_id = $( "input:text[name='c_product_id']").val(),
		product_name = $( "input:text[name='product_name']").val(),
		brand = $( "input:text[name='brand']").val(),
		style = $( "select[name='style']").val(),
		desc = $( "input:text[name='desc']").val(),
		photo = $( "input:hidden[name='new_photo']").val(),
		remove = $( "input:hidden[name='remove_photo']").val(),
		thumbnail = $( "input:hidden[name='new_thumbnail']").val(),
		removeThumbnail = $( "input:hidden[name='remove_thumbnail']").val(),
		photo3d = $( "input:hidden[name='new_photo3d']").val(),
		removePhoto3d = $( "input:hidden[name='remove_photo3d']").val(),
		product_id = $( "input:hidden[name='product_id']").val();

	// if( sex == "" ){
	// 	message("請輸入性別");
	// } else if( age == "" ){
	// 	message("請輸入年齡");
	// } else {
		let data = {
			"sex": sex, 
			"kind": kind, 
			"c_product_id": c_product_id, 
			"product_name": product_name, 
			"brand": brand, 
			"style": style, 
			"desc": desc, 
			"photo": photo,
			"remove": remove,
			"thumbnail": thumbnail,
			"removeThumbnail": removeThumbnail,
			"photo3d": photo3d,
			"removePhoto3d": removePhoto3d,
			"product_id": product_id
		};

		$.ajax({
		    url: '/mapi/product',
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
	let sex = $( "select[name='sex']").val(),
		kind = $( "select[name='kind']").val(),
		c_product_id = $( "input:text[name='c_product_id']").val(),
		product_name = $( "input:text[name='product_name']").val(),
		brand = $( "input:text[name='brand']").val(),
		style = $( "select[name='style']").val(),
		desc = $( "input:text[name='desc']").val(),
		check_photo = $( "input:file[name='photo']").val(),
		photo = $( "input:hidden[name='new_photo']").val(),
		check_thumbnail = $( "input:file[name='thumbnail']").val(),
		thumbnail = $( "input:hidden[name='new_thumbnail']").val(),
		check_photo3d = $( "input:file[name='photo3d']").val(),
		photo3d = $( "input:hidden[name='new_photo3d']").val(),
		product_id = $( "input:hidden[name='product_id']").val();

	if( sex == "" ){
		message("請輸入性別");
	} else if( kind == "" ){
		message("請輸入類別");
	} else if( c_product_id == "" ){
		message("請輸入料號");
	} else if( product_name == "" ){
		message("請輸入品名");
	} else if( brand == "" ){
		message("請輸入品牌");
	} else if( style == "" ){
		message("請輸入風格");
	} else if( desc == "" ){
		message("請輸入說明");
	} else if( check_photo == "" ){
		message("請挑選穿搭圖");
	} else if( check_thumbnail == "" ){
		message("請挑選展示圖");
	} else if( check_photo3d == "" ){
		message("請挑選3D圖");
	} else {
		let data = {
			"sex": sex, 
			"kind": kind, 
			"c_product_id": c_product_id, 
			"product_name": product_name, 
			"brand": brand, 
			"style": style, 
			"desc": desc,
			"photo": photo, 
			"thumbnail": thumbnail,
			"photo3d": photo3d,
			"product_id": product_id
		};

		$.ajax({
		    url: '/mapi/product',
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

$('#upd_thumbnail').change(function(){
	var file_data = $('#upd_thumbnail').prop('files')[0];
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
			$('#previewThumbnail')
				.attr('src', `/photo/preview?name=${ response }&kind=model`)
				.show();

			$( "input:hidden[name='new_thumbnail']").val(response);
		},
		error: function (response) {
			// $('.btn-primary').prop('disabled', true);
			// $('#msg').html(`<font color='red'>${ response.responseText }</font>`); // display error response from the server
		}
	});
})

$('#upd_photo3d').change(function(){
	var file_data = $('#upd_photo3d').prop('files')[0];
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
			$('#previewPhoto3d')
				.attr('src', `/photo/preview?name=${ response }&kind=model`)
				.show();

			$( "input:hidden[name='new_photo3d']").val(response);
		},
		error: function (response) {
			// $('.btn-primary').prop('disabled', true);
			// $('#msg').html(`<font color='red'>${ response.responseText }</font>`); // display error response from the server
		}
	});
})

function formReset() {
	document.getElementById("form_update").reset();
	$('#preview').attr('src','').hide();
	$('#previewThumbnail').attr('src','').hide();
	$('#previewPhoto3d').attr('src','').hide();
}