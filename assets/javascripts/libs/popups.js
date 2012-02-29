function changePopupColorTo(color) {
	var symbols;
	switch (color) {
		case "green":
			symbols="gr";
			break;
		case "orange":
		case "red":
			symbols="o";
			color="orange";
			break;
		case "blue":
			symbols="r";
			color="blue";
			break;
	}
	if ($('#success_upload')) {
		$('#success_upload').hide();
	}
	$('#canUploadDiv').show();
	$('#popupDiv1').attr("class", "bl_"+symbols);
	$('#popupDiv2').attr("class", "br_"+symbols);
	$('#popupDiv3').attr("class", "tl_"+symbols);
	$('#popupDiv4').attr("class", "tr_"+symbols);
	$('#popupTd1').attr("class", "tail_"+color);
}

var showPopupTimeoutID;
function showPopup(popupDivID, color, text, timeout) {
	if (text=="") {
		$('#'+popupDivID).slideUp('fast');
		return;
	}
	var symbols;
	switch (color) {
		case "green":
			symbols="gr";
			break;
		case "orange":
		case "red":
			symbols="o";
			color="orange";
			break;
		case "blue":
			symbols="r";
			color="blue";
			break;
	}
	var divCode="<table cellpadding='0' cellspacing='0' class='pop_up'>" +
            "<tr><td><div id='popupDiv1' class='bl_"+symbols+"'>" +
                "<div id='popupDiv2' class='br_"+symbols+"'>" +
                    "<div id='popupDiv3' class='tl_"+symbols+"'>" +
                        "<div id='popupDiv4' class='tr_"+symbols+"'>" +
                            "<span id='canUploadText'>"+text+"</span>" +
                "</div></div></div>" +
            "</div></td></tr>" +
            "<tr><td class='tail_"+color+"'></td></tr>" +
        "</table>";
    if ($('#'+popupDivID).html()=="") {
    	$('#'+popupDivID).hide();
    }
	$('#'+popupDivID).html(divCode);
	$('#'+popupDivID).slideDown('fast');
	clearTimeout(showPopupTimeoutID);
	if (timeout) {
		showPopupTimeoutID=setTimeout(
			function() {
				$('#'+popupDivID).slideUp('fast');
				$('#'+popupDivID).html(divCode);
			}, timeout);
	}
}