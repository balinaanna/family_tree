var OSX = {
	container: null,
	user_info: null,
	init_view: function (info) {
		//view person info on double click
		$("#osx-modal-content").modal({
			appendTo : "#home",
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
			appendTo : "#home",
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
					+ 100; // padding
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
							$('#user_id').val(user_data.info.user_id);
							$('#f_name').val(user_data.info.f_name);
							$('#l_name').val(user_data.info.l_name);
							$('#b_date').val(user_data.info.b_date);
							$('#d_date').val(user_data.info.b_date);
							$('#about').html(user_data.info.about);
							if(user_data.info.photo_url != '')
							{
								$('#text_image').attr('style','display: block');
								$('#photo').attr('src','trash/avatars/'+user_data.info.photo_url);
								$('#photo_native_size').attr('src','trash/avatars/'+user_data.info.photo_url);
								initImgCrop('trash/avatars/'+user_data.info.photo_url);
							}
							else
							{
								$('#text_image').attr('style','display: none');
							}
						}
						else
						{
							$('#text_image').attr('style','display: none');
							$('#data_table').attr('style','height: 495px;');
							$('#photo').attr('src','trash/avatars/no_avatar.jpg');
							$('#photo_native_size').attr('src','trash/avatars/no_avatar.jpg');
						}
						upclick({
							element: upload_input,
							action: 'upload_img.php',
							action_params: {'user_id': $('#user_id').val(), 'login_name': 'new'},/* change login !!! */
							onstart:
								function(filename)
								{
									//alert('Start upload: '+filename);
								},
							oncomplete:
								function(response) 
								{
									resp = JSON.parse(response);
									if(resp.success)
									{
										$('#photo').attr('src','trash/avatars/'+resp.photo_url);
										$('#photo_native_size').attr('src','trash/avatars/'+resp.photo_url);
										$('#text_image').attr('style','display: block');
										$('.imgareaselect-outer').attr('style','display:none;');
										$('.body div').each(function(index){
											if(this.style['z-index'] == 1004)
											{
												this.style.height = 0;
												this.style.width = 0;
											}				
										});										
										initImgCrop('trash/avatars/'+resp.photo_url);
									}
									else
									{
										alert('Wrong image format!');
									}
								}
						});
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
			$('.imgareaselect-outer').attr('style','display:none;');
			$('.body div').each(function(index){
				if(this.style['z-index'] == 1004)
				{
					this.style.display = 'none';
				}				
			});
			
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
		theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen,|,link,unlink,anchor,image,cleanup,help,code",
		theme_advanced_buttons3 : "undo,redo,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,insertdate,inserttime,preview,|,forecolor,backcolor,|,visualchars,nonbreaking,template,blockquote,pagebreak",
		theme_advanced_buttons4 : "tablecontrols,|,hr,removeformat,visualaid,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : false,

		// Skin options
		skin : "o2k7",
		skin_variant : "silver"
	});
}

function preview(img, selection) {
	var scaleX = 100 / (selection.width || 1);
	var scaleY = 100 / (selection.height || 1);
	$('#photo_div + div > img').css({
		width: Math.round(scaleX * $('#photo').width()) + 'px',
		height: Math.round(scaleY * $('#photo').height()) + 'px',
		marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
		marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
	});
}

function initImgCrop(imgName){
$('#photo_preview').attr('src', imgName);
	$('#photo').imgAreaSelect({
		aspectRatio: '1:1',
		handles: true,
		onSelectChange: preview,
		onSelectEnd: function ( image, selection ) {
			$('input[name=x1]').val(selection.x1);
			$('input[name=y1]').val(selection.y1);
			$('input[name=x2]').val(selection.x2);
			$('input[name=y2]').val(selection.y2);
			$('input[name=w]').val(selection.width);
			$('input[name=h]').val(selection.height);
		}
	})
}