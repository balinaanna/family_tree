<?php
$user_id = $_REQUEST['user_id'];
$login_name = $_REQUEST['login_name'];
if (preg_match('/(png|jpe?g|gif)$/', strtolower(end(explode(".", $_FILES['Filedata']['name']))))) {
	$tmp_file_name = $_FILES['Filedata']['tmp_name'];
	if($user_id !== '')	{
		$new_file_name = $user_id.'.'.end(explode(".", $_FILES['Filedata']['name']));
		//delete all login images
	} else {
		$new_file_name = $login_name.'.'.end(explode(".", $_FILES['Filedata']['name']));
	}

	$ok = move_uploaded_file($tmp_file_name, 'trash/avatars/'.$new_file_name);
	
	echo json_encode(array(success => $ok, photo_url => $new_file_name));
} else {
	echo json_encode(array(success => $ok));
}
?>