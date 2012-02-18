<?php
$tmp_file_name = $_FILES['Filedata']['tmp_name'];
$ok = move_uploaded_file($tmp_file_name, 'trash/avatars/new.jpg');//set file name!!!
echo json_encode(array(success => $ok, photo_url => 'new.jpg'));
?>