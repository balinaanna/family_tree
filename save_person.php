<?php 
$user_id = $_REQUEST['user_id'];
$f_name = $_REQUEST['f_name'];
$l_name = $_REQUEST['l_name'];
$b_date = $_REQUEST['b_date'];
$d_date = $_REQUEST['d_date'];

if($user_id !== '')
{
	//edit
	//Bogdan will update DB here :)
	crop_img($user_id);
}
else
{
	//add
	//Bogdan will insert new user to DB here :) He will get new user_id and only then pass $user_id to crop_img
	crop_img($user_id);
}

function crop_img($user_id)
{
	$w = $_REQUEST['w'];
	$h = $_REQUEST['h'];
	$x1 = $_REQUEST['x1'];
	$y1 = $_REQUEST['y1'];
	$x2 = $_REQUEST['x2'];
	$y2 = $_REQUEST['y2'];
	$photo_url = $_REQUEST['photo_url'];
	
	if($photo_url == 'trash/avatars/no_avatar.jpg')
	{
		$new_filename = $photo_url;
	}
	else
	{
		$new_filename = 'trash/avatars/'.$user_id.'_thumb.'.end(explode(".", $photo_url));
		list($current_width, $current_height) = getimagesize($photo_url);
		$crop_width = 100;
		$crop_height = 100;
		$new = imagecreatetruecolor($crop_width, $crop_height);
		switch(end(explode(".", $photo_url))){
			case 'jpg':
				$current_image = imagecreatefromjpeg($photo_url);
				break;
			case 'jpeg':
				$current_image = imagecreatefromjpeg($photo_url);
				break;
			case 'png':
				$current_image = imagecreatefrompng($photo_url);
				break;
			case 'gif':
				$current_image = imagecreatefromgif($photo_url);
				break;
		}
		imagecopyresampled($new, $current_image, 0, 0, $x1, $y1, $crop_width, $crop_height, $w, $h);
		imagejpeg($new, $new_filename, 95);
	}
}
echo json_encode(array(photo_url => $new_filename));
?>
