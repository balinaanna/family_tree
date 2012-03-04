var OSX = {
	container: null,
	user_info: null,
	init_edit: function (info, user_info) {
		//edit or add new person
		data = info;
		user_data = user_info;
		$("#osx-modal-content-edit").modal({
			appendTo : "#wr",
			overlayId: 'osx-overlay',
			containerId: 'osx-container',
			closeHTML: null,
			minHeight: 80,
			opacity: 65,
			position: ['0',],
			overlayClose: true,
			onOpen: OSX.open_edit,
			onClose: OSX.close
		});
        $("#b_date").datepicker({ changeYear: true, yearRange: '1900:2050', createButton:false, clickInput:true });
        $("#d_date").datepicker({ changeYear: true, yearRange: '1900:2050', createButton:false, clickInput:true });
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
				case 'add_spouse':
					title=$("#osx-modal-title-edit").html("Adding spouse");
					break;
			}
			title.show();

			d.container.slideDown('slow', function () {
				setTimeout(function () {
					var h = $("#osx-modal-data-edit", self.container).height()
					+ title.height()
					+ 0; // padding
					d.container.animate(
					{
						height: h
					},
					200,
					function () {
						$("div.close-edit", self.container).show();
						$("#osx-modal-data-edit", self.container).show();
						$('#cropped').val('');
						$('#uploaded').val('');
						if(data.action == 'edit_person')
						{
							$('#user_id').val(user_data.info.user_id);
							$('#f_id').val(user_data.info.f_id);
							$('#m_id').val(user_data.info.m_id);
							$('#ch_ids').val(user_data.info.ch_ids);
							$('#spouse_id').val(user_data.info.spouse_id);
							$('#f_name').val(user_data.info.f_name);
							$('#l_name').val(user_data.info.l_name);
							$('#b_date').val(user_data.info.b_date);
							$('#d_date').val(user_data.info.d_date);
							$('#about').html(user_data.info.comment);
							if(user_data.info.photo_url != 'no_avatar.jpg')
							{
								$('#photo_preview').attr('src', 'assets/images/uploaded/avatars/thumbs/'+user_data.info.photo_url);
								$('#photo_preview').css('max-width', '100px');
								$('#photo_preview').css('max-height', '100px');
							}
							else
							{
								$('#photo_preview').css('display','none');
							}

							if(user_data.info.sex == 'm')
							{
								$('#m_radio').attr('checked', true);
							}
							else if(user_data.info.sex == 'f')
							{
								$('#f_radio').attr('checked', true);
							}

							if(user_data.info.photo_url != '')
							{
								$('#photo').attr('src','assets/images/uploaded/avatars/'+user_data.info.photo_url);
								if(user_data.info.photo_url != 'no_avatar.jpg')
								{
									$('#text_image').attr('style','display: block');
									$('#photo_native_size').attr('src','assets/images/uploaded/avatars/'+user_data.info.photo_url);
									initImgCrop('assets/images/uploaded/avatars/'+user_data.info.photo_url);
								}
							}
							else
							{
								$('#text_image').attr('style','display: none');
							}
						}
						else
						{
							$('#m_radio').attr('checked', true);
							$('#text_image').attr('style','display: none');
							$('#data_table').attr('style','height: 495px;');
							$('#photo').attr('src','assets/images/uploaded/avatars/no_avatar.jpg');
							$('#photo_native_size').attr('src','assets/images/uploaded/avatars/no_avatar.jpg');
						}
						upclick({
							element: upload_input,
							action: 'server/api/save_photo',
							action_params: {
								'user_id': $('#user_id').val(), 
								'login_name': 'new'
							},/* change login !!! */
							onstart:
							function(filename)
							{
							//alert('Start upload: '+filename);
							},
							oncomplete:
							function(response)
							{
								resp = JSON.parse(response);
								if(resp.status == "1")
								{
									$('#photo_preview').css('display','none');
									$('#uploaded').val('1');
									$('#photo').attr('src','/assets/images/uploaded/avatars/'+resp.response);
									$('#photo_native_size').attr('src','/assets/images/uploaded/avatars/'+resp.response);
									$('#text_image').attr('style','display: block');
									$('.imgareaselect-outer').attr('style','display:none;');
									$('.body div').each(function(index){
										if(this.style['z-index'] == 1004)
										{
											this.style.height = 0;
											this.style.width = 0;
										}
									});
									initImgCrop('/assets/images/uploaded/avatars/'+resp.response);
								}
								else
								{
									alert('Wrong image format!');
								}
							}
						});
						initMCE();
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
		oninit : myCustomOnInit,

		// Skin options
		skin : "o2k7",
		skin_variant : "silver"
	});
}

function keypress_content(e){
	var tiny_text = $('#about_ifr').contents().find('#tinymce').html();
	var first_textarea = $('#about');
	first_textarea.html(tiny_text);
}

function myCustomOnInit() {
	$('#submit_person').bind('click', keypress_content);
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
	$('#photo_preview').css('display','block');
	$('#photo_preview').attr('src', $('#photo').attr('src'));
	$('#photo_preview').css('max-width', '');
	$('#photo_preview').css('max-height', '');
}

function initImgCrop(imgName){
	
	$('#photo').imgAreaSelect({
		aspectRatio: '1:1',
		handles: true,
		onSelectChange: preview,
		onSelectEnd: function ( image, selection ) {
			$('#cropped').val('1');
			$('input[name=x1]').val(selection.x1);
			$('input[name=y1]').val(selection.y1);
			$('input[name=x2]').val(selection.x2);
			$('input[name=y2]').val(selection.y2);
			$('input[name=w]').val(selection.width);
			$('input[name=h]').val(selection.height);
		}
	})
}