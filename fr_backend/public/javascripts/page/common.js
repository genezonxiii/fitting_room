function message(text){
	$(`<div>${ text }</div>`).dialog({
	    title: "提示",
	    modal: true,
	    open: function(event, ui) {
	        $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
	    },
	    buttons: [{
	        text: "確認",
	        click: function() {
	            $(this).dialog("close");
	        }
	    }]
	});
}

function message_confirm(title, text, ok){
	$(`<div>${ text }</div>`).dialog({
	    title: title,
	    modal: true,
	    open: function(event, ui) {
	        $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
	    },
	    buttons: [{
	    	text: "確認刪除",
	    	click: function() {
	            $(this).dialog("close");
	            ok();
	        }
	    }, {
	        text: "取消",
	        click: function() {
	            $(this).dialog("close");
	        }
	    }]
	});
}