let table = null,
	template_url = `/mapi/order/A`;
getMaster(template_url);
let flag = false, process = null;
setStore();

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
			"title": "訂單編號",
			"data": "order_no"
		}, {
			"title": "訂購日期",
			"data": "sale_date"
		}, {
			"title": "暱稱",
			"data": "nick_name"
		}, {
			"title": "功能"
    }],
    columnDefs: [{
			targets: 0,
			className: 'dt-body-center',
			width: "20%"
		}, {
			targets: 1,
			className: 'dt-body-center',
			width: "20%",
			render: function ( data, type, row ) {
				return moment(data).format("YYYY/MM/DD")
			}
		}, {
			targets: 2,
			className: 'dt-body-center',
			width: "20%"
		}, {
			targets: -1,
			className: 'dt-body-center',
			width: "15%",
			render: function ( data, type, row ) {
				let btn_detail = '<button type="button" class="btn_detail btn btn-primary btn-wide">查看明細</button>',
					btn_edit = '<button type="button" class="btn_edit btn btn-exec btn-wide">轉已處理</button>';
				return `<div class="btn-row">${ btn_detail }<br><br>${ btn_edit }</div>`;
			}
    }]
	});
}

function getDetail(url) {
	table = $("#detail").DataTable({
		destroy: true,
		ajax: {
      url: url,
    	dataSrc: function ( json ) {
        return json;
      }
    },
    columns: [{
			"title": "品名",
			"data": "product_name"
		}, {
			"title": "料號",
			"data": "c_product_id"
		}, {
			"title": "性別",
			"data": "sex"
		}, {
			"title": "類別",
			"data": "kind"
    }, {
			"title": "風格",
			"data": "style"
		}, {
			"title": "尺寸",
			"data": "size"
    }, {
			"title": "顏色",
			"data": "color"
    }, {
			"title": "數量",
			"data": "qty"
    }, {
			"title": "圖檔",
			"data": "photo"
		}],
    columnDefs: [{
			targets: 0,
			className: 'dt-body-center',
			width: "20%"
		}, {
			targets: 2,
    	className: 'dt-body-center',
    	// width: "5%",
    	render: function ( data, type, row ) {
    		return data === 'F'?'女':'男';
    	}
    }, {
			targets: 3,
			className: 'dt-body-center',
			width: "20%",
    	render: function ( data, type, row ) {
				switch(data) {
					case "cloth": 
						return "上衣";
						break;
					case "pants": 
						return "褲/裙"; 
						break;
					case "shoes": 
						return "鞋子"; 
						break;
					default:  
						return "";
				}
    	}
		}, {
    	targets: -1,
    	className: 'dt-body-center',
    	width: "20%",
    	render: function ( data, type, row ) {
    		return `<img src="/photo/${ row.kind }/${ data }" alt="${ data }" class="preview" style="display: inline;">`;
    	}
    }]
	});
}

$('body').on('click', 'button.btn_edit', function() {
  var row = $(this).closest("tr");
  var data = $("#list").DataTable().row(row).data();

	message_confirm("提示", `是否將訂單編號 ${ data.order_no } 設為已處理?`, function(){ 
		$.ajax({
			url: '/mapi/order',
			type: 'PUT',
			dataType: 'text',
			data: data,
			success: function(response) {
				let res = JSON.parse(response);
				message(res.result);
				table.ajax.reload();
			}
		});
	})
});

$('body').on('click', 'button.btn_detail', function() {
  var row = $(this).closest("tr");
  var data = $("#list").DataTable().row(row).data();

	getDetail(`/mapi/detail/${data.sale_id}`);

	$('#dlg_detail').dialog({
    title: `訂單編號 ${data.order_no} 明細`,
    modal: true,
    width: 750,
    open: function(event, ui) {
      $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
    },
    buttons: [{
    	text: "關閉",
    	click: function() {
        $(this).dialog("close");
      }
    }]
	});
});

function setStore() {
	$.ajax({
		url: '/api/store/wen',
		type: 'GET',
		dataType: 'text',
		success: function(response) {
			let res = JSON.parse(response);
			res.forEach(item => {
				$('#store').append(`<option value="${item.type}">${item.value}</option>`)
			})
		}
	});
}

$('#store').change(function(){
	getMaster(`/mapi/order/${$(this).val()}`);
})

function start() {
	process = setInterval(function(){ 		
		getMaster(`/mapi/order/${$('#store').val()}`)
	}, 1000 * parseInt($('input[name="interval"]').val()));
}

function stop() {
	clearInterval(process);
}

$('.btn-interval').click(function() {
	flag = !flag;
	if (flag) {
		$(this).text('停止').addClass('btn-alert').removeClass('btn-green');
		start();
	} else {
		$(this).text('啟動').addClass('btn-green').removeClass('btn-alert');
		stop();
	}
})