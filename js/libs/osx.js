var OSX = {
	container: null,
	user_info: null,
	init_view: function (info) {
		//view person info on double click
		$("#osx-modal-content").modal({
			overlayId: 'osx-overlay',
			containerId: 'osx-container',
			closeHTML: null,
			minHeight: 80,
			opacity: 65,
			position: ['0',],
			overlayClose: true,
			onOpen: OSX.open_view,
			onClose: OSX.close
		});
		user_info=info;
	},
	init_edit: function (info, user_info) {
		//edit or add new person
		data = info;
		user_data = user_info;
		$("#osx-modal-content-edit").modal({
			overlayId: 'osx-overlay',
			containerId: 'osx-container',
			closeHTML: null,
			minHeight: 80,
			opacity: 65,
			position: ['0',],
			overlayClose: true,
			onOpen: OSX.open_edit,
			onClose: OSX.close,
			onShow: function() {
				initMCE();
			}
		});
	},
	open_view: function (d) {
		//view person info on double click
		var self = this;
		self.container = d.container[0];
		d.overlay.fadeIn('slow', function () {
			$("#osx-modal-content", self.container).show();
			var title = $("#osx-modal-title", self.container);
			title=$("#osx-modal-title").html(user_info.l_name+" "+user_info.f_name+" ("+user_info.b_date+" - "+user_info.d_date+")");
			title.show();
			$("#div-about").append(user_info.about);
			d.container.slideDown('slow', function () {
				setTimeout(function () {
					var h = $("#osx-modal-data", self.container).height()
					+ title.height()
					+ 20; // padding
					d.container.animate(
					{
						height: h
					},
					200,
					function () {
						$("div.close", self.container).show();
						$("#osx-modal-data", self.container).show();
					}
					);
				}, 300);
			});
		});

	},
	open_edit: function (d) {
		//edit or add new person
		var self = this;
		self.container = d.container[0];
		d.overlay.fadeIn('slow', function () {
			$("#osx-modal-content-edit", self.container).show();

			var title = $("#osx-modal-title-edit", self.container);
			switch (data.action){
				case 'add_child':
					title=$("#osx-modal-title-edit").html("Adding child");
					break;
				case 'add_parent':
					title=$("#osx-modal-title-edit").html("Adding parent");
					break;
				case 'edit_person':
					title=$("#osx-modal-title-edit").html("Editing person");
					break;
			}
			title.show();

			d.container.slideDown('slow', function () {
				setTimeout(function () {
					var h = $("#osx-modal-data-edit", self.container).height()
					+ title.height()
					+ 20; // padding
					d.container.animate(
					{
						height: h
					},
					200,
					function () {
						$("div.close-edit", self.container).show();
						$("#osx-modal-data-edit", self.container).show();
						if(data.action == 'edit_person')
						{
							$('#f_name').val(user_data.info.f_name);
							$('#l_name').val(user_data.info.l_name);
							$('#b_date').val(user_data.info.b_date);
							$('#d_date').val(user_data.info.b_date);
							$('#about').html(user_data.info.about);
						}
					}
					);
				}, 300);
			});
		})

	},
	close: function (d) {
		var self = this; // this = SimpleModal object
		d.container.animate(
		{
			top:"-" + (d.container.height() + 20)
		},
		500,
		function () {
			self.close(); // or $.modal.close();
		}
		);
	}
};

function initMCE(){
	return tinyMCE.init({
		// General options
		mode : "exact",
		theme : "advanced",
		plugins : "autolink,lists,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
		elements : "about",
		editor_selector :"mceEditor",

		// Theme options
		theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : false,

		// Skin options
		skin : "o2k7",
		skin_variant : "silver"
	});
}