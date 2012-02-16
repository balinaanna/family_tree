<?php
// оригинальное изображение
$filename = 'photo.jpg';
//die(print_r($_POST));
$new_filename = 'photo1.jpg';

// получаем размеры изображения
list($current_width, $current_height) = getimagesize($filename);

// координаты x и y оригинального изображение, где мы
// буем вырезать фрагмент, по данным, берущимся из формы
$x1    = $_POST['x1'];
$y1    = $_POST['y1'];
$x2    = $_POST['x2'];
$y2    = $_POST['y2'];
$w    = $_POST['w'];
$h    = $_POST['h'];     

//die(print_r($_POST));

// финальные размеры изображения
$crop_width = 100;
$crop_height = 100;

// создаём маленькое изображение
$new = imagecreatetruecolor($crop_width, $crop_height);
// создаём оригинальное изображение
$current_image = imagecreatefromjpeg($filename);
//вырезаем
imagecopyresampled($new, $current_image, 0, 0, $x1, $y1, $crop_width, $crop_height, $w, $h);
// создаём новое изображение
imagejpeg($new, $new_filename, 95);
?>
