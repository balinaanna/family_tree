<?php
class Image_model extends CI_Model {
    // available properties (variables)	REDEFINE IN PAGE AS NEEDED
	
	// GENERIC - as in used by upload and resize functions
	public $newName 		= '';			// new image name (without file extension)
	public $returnType		= 'fullpath'; 	// specify return type - fullpath | array | bool | blob
	public $safeRename		= 'true';		// rename the new file to remove unsafe characters and spaces
	public $duplicates		= 'o'; 			// u = make unique / o = overwrite / e = error / a = abort
	
	// UPLOAD FUNCTION
	public $uploadTo		= '../assets/images/uploaded/avatars/';	// folder to upload to (relative to calling document)
	
	// RESIZE FUNCTION
	public $source_file 	= '';			// source file to resize
	public $newWidth 		= '';			// new image width - e.g. '200' = 200 pixels
	public $newHeight 		= '';			// new image height - e.g. '200' = 200 pixels
	public $namePrefix 		= '';			// prefix the resized file
	public $newPath 		= '../assets/images/uploaded/avatars/thumbs';			// path to save the new resized file
	public $aspectRatio 	= 'true';		// keep the aspect ratio - true | false
	public $oversize 		= 'false';		// resize to fill space - this can cause oversized images but will fill the frame created by w/h supplied - true | false
	public $padToFit 		= 'true';		// pad the image with the pad colour to fit the new image dimensions - true | false
	public $upscale 		= 'false';		// enlarge smaller images or not - true | false
	public $setPosition		= 'cc';			// set position of image within its canvas - e.g. 'cc' = center x center y OR 'tr' = top right
	public $padColour 		= '#FFFFFF';	// set background padding colour - '#XXXXXX' or 'transparent' (transparent requires PNG type)
	public $padTransparent	= 'true'; 		// if uploading a GIF or PNG then set background as transparent - this overrides $padColour
	public $newImgType		= ''; 			// force resized image to be jpg | gif | png | wbmp - leave blank to match source type
	public $imgQuality		= '80';			// image quality 1-100 (%)
	
	
	
	// array of all generated error messages
	public $errors = array(
		'no-image' 		=> '<strong>Error:</strong> Please specify a source image - declare: $mj_Image->source_file = "path_to_your_image_here.jpg";',
		'no-width' 		=> '<strong>Error:</strong> Please specify a width for the new image - declare: $mj_Image->newWidth = 100;',
		'no-height' 	=> '<strong>Error:</strong> Please specify a height for the new image - declare: $mj_Image->newheight = 100;',
		'image-exists' 	=> '<strong>Error:</strong> The image you specified already exists',
		'upl-no-array'	=> '<strong>Error:</strong> It appears the form did not submit a valid file - please try again.',
		'upl-ini-max'	=> '<strong>Error:</strong> The file uploaded exceeds the filesize limit set on this server',
		'upl-maxsize'	=> '<strong>Error:</strong> The file uploaded exceeds the filesize limit set for this form',
		'upl-partial'	=> '<strong>Error:</strong> The file was only partially uploaded - please try again',
		'upl-no-file'	=> '<strong>Error:</strong> No file was submitted for upload',
		'upl-no-tmpDir'	=> '<strong>Error:</strong> The temporary upload directory is missing',
		'upl-cant-write'=> '<strong>Error:</strong> Failed to write to the temporary folder - please check the permissions',
		'upl-ext'		=> '<strong>Error:</strong> The upload was stopped due to an invalid file extension',
		'upl-no-size'	=> '<strong>Error:</strong> The file submitted for upload had a filesize of zero or was corrupt',
		'upl-failed'	=> '<strong>Error:</strong> The upload failed - the file could not be moved to the target location - please check the permissions',
		'no-crop-width' => '<strong>Error:</strong> Please specify a crop width for the new image',
		'no-crop-height'=> '<strong>Error:</strong> Please specify a crop height for the new image',
		'no-crop-x' 	=> '<strong>Error:</strong> Please specify a crop x position for the new image',
		'no-crop-y'		=> '<strong>Error:</strong> Please specify a crop y position for the new image',
		'crop-ext'		=> '<strong>Error:</strong> The crop was stopped due to an invalid file extension',
	);
	
	#################################################
	#					 METHODS					#
	#################################################

	// This function runs when this class is instantiated
	public function __construct() {
		//echo 'newImage Constructed';
	}

	private function hex2dec($_hex) {
		$_color = str_replace('#', '', $_hex);
		$_ret = array(
			'r' => hexdec(substr($_color, 0, 2)),
			'g' => hexdec(substr($_color, 2, 2)),
			'b' => hexdec(substr($_color, 4, 2))
		);
		return $_ret;
	}
	
	public function cleanUp($str) {
		$str = stripslashes($str);
		$str = str_replace(' ','_',$str);
		$str = str_replace('.JPG','.jpg',$str);
		$str = str_replace('.JPEG','.jpeg',$str);
		$str = str_replace('.PNG','.png',$str);
		$str = str_replace('.GIF','.gif',$str);
		$str = preg_replace("/[^A-Za-z0-9_\-\.]/i", "",$str);
		return $str;
	}
	
	public function upload($ar) {
		// ERROR CAPTURE
		if(!isset($ar['name'])) { $this->doDie($this->errors['upl-no-array']); exit; } 
		
		if ( !in_array( strtolower(end(explode(".", $ar['name']))), array('jpg', 'jpeg', 'png', 'gif') ) )
		{
			$resp['error'] = 'Wrong format of file';
			return $resp;
		}
		if($ar['error']!=0) { 
			switch($ar['error']) {
				case 1: $msg = $this->doDie($this->errors['upl-ini-max']); 	break;
				case 2: $msg = $this->doDie($this->errors['upl-maxsize']); 	break;
				case 3: $msg = $this->doDie($this->errors['upl-partial']); 	break;
				case 4: $msg = $this->doDie($this->errors['upl-no-file']); 	break;
				case 6: $msg = $this->doDie($this->errors['upl-no-tmpDir']); break;
				case 7: $msg = $this->doDie($this->errors['upl-cant-write']); break;
				case 8: $msg = $this->doDie($this->errors['upl-ext']); break;
			}
			$resp['error'] = $msg;
			return $resp;
		}
		if($ar['size']==0) { $this->doDie($this->errors['upl-no-size']); exit; } 

		// create variables
		$img_name 		= $ar['name'];
		$img_type 		= $ar['type'];
		$img_tmp_name 	= $ar['tmp_name'];
		$img_error		= $ar['error'];
		$img_size		= $ar['size'];
		
		// original extension
		$ext = substr(strrchr($img_name,'.'),1);
		
		// rename file to safe filename
		if($this->safeRename=='true') {
			$imgPath = str_replace(basename($img_name),"",$img_name);
			$imgName = ($this->newName!='') ? $this->newName : $img_name;
			$imgName = $this->cleanUp(basename($imgName));
			$img_name = $imgPath.$imgName;
		}
		
		// ensure the extension is correct if the name has been altered
		if(strrchr($img_name,'.')) { // has extension
			$new_ext = substr(strrchr($img_name,'.'),1);
			if($new_ext!=$ext) { 
				$img_name = str_replace($new_ext,'',$img_name).'.'.$ext; // use original extension
			}
		} else { // no extension
			$img_name = $img_name.'.'.$ext; // add in original
		}
		
		// set target path
		$target_path = $this->uploadTo . basename($img_name);
		
		// Handle duplicates
		if(file_exists($target_path)) {
			switch($this->duplicates) {
				case 'o': break;
				case 'e': $this->doDie($this->errors['image-exists']); exit;
				case 'a': return false; break;
				default: // make unique
					$im = (strstr(basename($img_name),'.')) ? substr(basename($img_name),0,strrpos(basename($img_name),'.')) : basename($img_name);
					$ext = str_replace($im,"",basename($img_name));
					$path = $this->uploadTo;
					$i=1;
					while(file_exists($path.$im.$i.$ext)) {
						$i++;
					}
					$imgName = $im.$i.$ext;
					$imgPath = str_replace(basename($img_name),"",$img_name);
					$img_name = $imgPath.$imgName;
					$target_path = $this->uploadTo . $imgName;
			}
		}
		
		// Make path writable // chmod file to 0777 if possible
		if(file_exists($target_path)) {
			@chmod($target_path, 0777);
		}
		
		// Do upload / move image to target path
		if(move_uploaded_file($img_tmp_name, $target_path)) {
			
			// add uploaded file to $this->source_file for resize function quick access
			$this->source_file = $this->uploadTo.basename($img_name);
			
    		// Return image, array or blob if required
			switch(strtolower($this->returnType)) {
				case 'array': 
					$_ar = array(
						'image' 	=> basename($img_name),
						'path'		=> $this->uploadTo,
						'size'		=> $img_size
					);
					return $_ar; break;
				case 'fullpath':
					return (file_exists($target_path)) ? $target_path : false; break;
				case 'blob':
					if(file_exists($target_path)) {
						$fo = fopen($target_path, 'r');
						$blob = mysql_real_escape_string(fread($fo, filesize($target_path)));
						fclose($fo);
						return $blob; break;
					} else { return false; break; }
				default:
					return (file_exists($target_path)) ? true : false; break;
			}
		} else{
			$this->doDie($this->errors['upl-failed']); exit;
		}
	}
	
	public function crop_img($source_file, $w, $h, $x1, $y1, $x2, $y2, $user_id)
	{
		$this->source_file = $source_file;
		$sImage = (($this->source_file!='')&&(file_exists($this->source_file))) ? $this->source_file : $this->doDie($this->errors['no-image']);
		$srcPath = (strstr($sImage,'/')) ? substr($sImage,0,strrpos($sImage,'/')+1) : '';
		$srcName = str_replace($srcPath,'',$sImage);
		//copy($image->uploadTo.$srcName, $image->newPath.'/'.$srcName);
		$photo_url = $this->uploadTo.$srcName;

		/*if($srcName == 'no_avatar.jpg')
		{
			$new_filename = $image->newPath.'/'.$srcName;
		}
		else
		{*/
			$new_filename = $this->newPath.'/'.$srcName;
			list($current_width, $current_height) = getimagesize($photo_url);
			$crop_width = 100;
			$crop_height = 100;
			$new = imagecreatetruecolor($crop_width, $crop_height);
			switch(strtolower(end(explode(".", $photo_url)))){
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
		//}
	}
	public function crop($w=false,$h=false,$x=false,$y=false) {
		// ERROR CAPTURE
		if(!$w) { 	$this->doDie($this->errors['no-crop-width']); exit; }
		if(!$h) { 	$this->doDie($this->errors['no-crop-height']); exit; }
		if(is_int($x)) { 	$this->doDie($this->errors['no-crop-x']); exit; }
		if(is_int($y)) { 	$this->doDie($this->errors['no-crop-y']); exit; }
		$sImage = (($this->source_file!='')&&(file_exists($this->source_file))) ? $this->source_file : $this->doDie($this->errors['no-image']);
		
		// make sure the new dimensions are numbers
		$w = (!is_int($w)) ? intval($w) : $w;
		$h = (!is_int($h)) ? intval($h) : $h;
		$x = (!is_int($x)) ? intval($x) : $x;
		$y = (!is_int($y)) ? intval($y) : $y;
		
		// get image details
		$image_info = getimagesize($sImage);
		
		// set source as resource
		switch($image_info['mime']) {
			case 'image/gif':
				if (imagetypes() & IMG_GIF)  { // not the same as IMAGETYPE
					$src = imagecreatefromgif($this->source_file);
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'gif';
				} else {
					$this->doDie($this->errors['crop-ext'].' - GIF images are not supported');
				}
				break;
			case 'image/jpeg':
				if (imagetypes() & IMG_JPG)  {
					$src = imagecreatefromjpeg($this->source_file) ;
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'jpg';
				} else {
					$this->doDie($this->errors['crop-ext'].' - JPEG images are not supported');
				}
				break;
			case 'image/png':
				if (imagetypes() & IMG_PNG)  {
					$src = imagecreatefrompng($this->source_file);
					imagealphablending($src, true); // setting alpha blending on (we want to blend this image with the canvas)
					imagesavealpha($src, true); // save alphablending setting
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'png';
				} else {
					$this->doDie($this->errors['crop-ext'].' - PNG images are not supported');
				}
				break;
			case 'image/wbmp':
				if (imagetypes() & IMG_WBMP)  {
					$src = imagecreatefromwbmp($this->source_file) ;
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'wbmp';
				} else {
					$this->doDie($this->errors['crop-ext'].' - WBMP images are not supported');
				}
				break;
			default:
				$this->doDie($this->errors['crop-ext'].' - '.$image_info['mime'].' files are not supported');
				break;
    	}
		
		$srcPath = (strstr($sImage,'/')) ? substr($sImage,0,strrpos($sImage,'/')+1) : '';
		$srcName = str_replace($srcPath,'',$sImage);
		
		$path = ($this->newPath!='') ? trim($this->newPath) : trim($srcPath);
		$path = (substr($path,strlen($path)-1,strlen($path))!='/') ? $path.'/' : $path;
		$imgName = ($this->newName!='') ? $this->newName : $srcName;
		
		$imgName = (strstr($imgName,'.')) ? substr($imgName,0,strrpos($imgName,'.')).'.'.$this->imgType 
										  : $imgName.'.'.$this->imgType; // make sure it has the correct extension
		
		$preFix = ($this->namePrefix!='') ? $this->namePrefix : '';
		
		// if path doesn't exist then create it and chmod to 0777
		if(!file_exists($path)) { mkdir($path, 0777); }
		
		// rename file to safe filename
		if($this->safeRename=='true') {
			$imgName = $this->cleanUp($imgName);
		}
		
		// Handle duplicates
		if(file_exists($path.$preFix.$imgName)) {
			switch($this->duplicates) {
				case 'o': break;
				case 'e': $this->doDie($this->errors['image-exists']); exit;
				case 'a': return false; break;
				default: // make unique
					$im = (strstr($imgName,'.')) ? substr($imgName,0,strrpos($imgName,'.')) : $imgName;
					$i=1;
					while(file_exists($path.$im.$i.'.'.$this->imgType)) {
						$i++;
					}
					$imgName = $im.$i.'.'.$this->imgType;
			}
		}
		
		// Source dimensions
		$s_width = imagesx($src);
		$s_height = imagesy($src);
		
		// Create target image
		$canvas = imagecreatetruecolor($w, $h);
		
		//echo ($canvas.' - '.$src.' - '.$x.' - '.$y.' - 0 - 0 - '.$s_width.' - '.$s_height.' - '.$s_width.' - '.$s_height);
		
		// Copy image
		imagecopyresampled($canvas, $src, $x, $y, 0, 0, $s_width, $s_height, $s_width, $s_height);
		
		// output image
		switch($this->imgType) {
			case 'gif': 	$newImg = imagejpeg($canvas, $path.$preFix.$imgName, $this->imgQuality);
			case 'png':
				$quality = (intval($this->imgQuality) > 90) ? 9 : round(intval($this->imgQuality)/10);
				//imagealphablending($canvas, false);
				//imagesavealpha($canvas, true);
				$newImg = imagepng($canvas, $path.$preFix.$imgName,$quality);
			case 'wbmp': 	$newImg = imagewbmp($canvas, $path.$preFix.$imgName);
			default: 		$newImg = imagejpeg($canvas, $path.$preFix.$imgName, $this->imgQuality);
		}
		
		// clean up
		imagedestroy($src);
		imagedestroy($canvas);
		
		// Return image, array or blob if required
		switch(strtolower($this->returnType)) {
			case 'array': 
				$_ar = array(
					'image' 	=> $imgName,
					'prefix'	=> $preFix,
					'path'		=> $path,
					'height'	=> $h,
					'width'		=> $w
				);
				return $_ar; break;
			case 'fullpath':
				return (file_exists($path.$preFix.$imgName)) ? $path.$preFix.$imgName : false; break;
			case 'blob':
				if(file_exists($path.$preFix.$imgName)) {
					$fo = fopen($path.$preFix.$imgName, 'r');
					$blob = mysql_real_escape_string(fread($fo, filesize($path.$preFix.$imgName)));
					fclose($fo);
					return $blob; break;
				} else { return false; break; }
			default:
				return (file_exists($path.$preFix.$imgName)) ? true : false; break;
		}
	}
	
	public function resize() {
		// ERROR CAPTURE
		if($this->newWidth=='') { 	$this->doDie($this->errors['no-width']); exit; }
		if($this->newHeight=='') { 	$this->doDie($this->errors['no-height']); exit; }
		$sImage = (($this->source_file!='')&&(file_exists($this->source_file))) ? $this->source_file : $this->doDie($this->errors['no-image']);
		
		// make sure the new dimensions are numbers
		$this->newWidth = (!is_int($this->newWidth)) ? intval($this->newWidth) : $this->newWidth;
		$this->newHeight = (!is_int($this->newHeight)) ? intval($this->newHeight) : $this->newHeight;
		
		// get image details
		$image_info = getimagesize($sImage);
		
		// If oversize is used then turn off padToFit
		if($this->oversize=='true') {
			$this->padToFit = 'false';
		}
		
		// select the filetype based on file MIME
		// set source as resource
		switch ($image_info['mime']) {
			case 'image/gif':
				if (imagetypes() & IMG_GIF)  { // not the same as IMAGETYPE
					$src = imagecreatefromgif($this->source_file);
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'gif';
				} else {
					$this->doDie($this->errors['upl-ext'].' - GIF images are not supported');
				}
				break;
			case 'image/jpeg':
				if (imagetypes() & IMG_JPG)  {
					$src = imagecreatefromjpeg($this->source_file) ;
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'jpg';
				} else {
					$this->doDie($this->errors['upl-ext'].' - JPEG images are not supported');
				}
				break;
			case 'image/png':
				if (imagetypes() & IMG_PNG)  {
					$src = imagecreatefrompng($this->source_file);
					imagealphablending($src, true); // setting alpha blending on (we want to blend this image with the canvas)
					imagesavealpha($src, true); // save alphablending setting
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'png';
				} else {
					$this->doDie($this->errors['upl-ext'].' - PNG images are not supported');
				}
				break;
			case 'image/wbmp':
				if (imagetypes() & IMG_WBMP)  {
					$src = imagecreatefromwbmp($this->source_file) ;
					$this->imgType = ($this->newImgType!=='') ? $this->newImgType : 'wbmp';
				} else {
					$this->doDie($this->errors['upl-ext'].' - WBMP images are not supported');
				}
				break;
			default:
				$this->doDie($this->errors['upl-ext'].' - '.$image_info['mime'].' files are not supported');
				break;
    	}
		
		$srcPath = (strstr($sImage,'/')) ? substr($sImage,0,strrpos($sImage,'/')+1) : '';
		$srcName = str_replace($srcPath,'',$sImage);
		
		
		$path = ($this->newPath!='') ? trim($this->newPath) : trim($srcPath);
		$path = (substr($path,strlen($path)-1,strlen($path))!='/') ? $path.'/' : $path;
		$imgName = ($this->newName!='') ? $this->newName : $srcName;
		
		$imgName = (strstr($imgName,'.')) ? substr($imgName,0,strrpos($imgName,'.')).'.'.$this->imgType 
										  : $imgName.'.'.$this->imgType; // make sure it has the correct extension
		
		$preFix = ($this->namePrefix!='') ? $this->namePrefix : '';
		
		// if path doesn't exist then create it and chmod to 0777
		if(!file_exists($path)) { mkdir($path, 0777); }
		
		// rename file to safe filename
		if($this->safeRename=='true') {
			$imgName = $this->cleanUp($imgName);
		}
		
		// Handle duplicates
		if(file_exists($path.$preFix.$imgName)) {
			switch($this->duplicates) {
				case 'o': break;
				case 'e': $this->doDie($this->errors['image-exists']); exit;
				case 'a': return false; break;
				default: // make unique
					$im = (strstr($imgName,'.')) ? substr($imgName,0,strrpos($imgName,'.')) : $imgName;
					$i=1;
					while(file_exists($path.$im.$i.'.'.$this->imgType)) {
						$i++;
					}
					$imgName = $im.$i.'.'.$this->imgType;
			}
		}
		
		// Source dimensions
		$s_width = imagesx($src);
		$s_height = imagesy($src);
		
		// canvas dimensions
		$c_width = $this->newWidth;
		$c_height = $this->newHeight;
		
		// maintain the aspect ratio
		if($this->aspectRatio=='true') {
			if($s_width > $s_height) { 
				if($this->oversize=='true') { // resize to fill the frame - oversized images
					$resize_pc = ($this->newHeight/$s_height);
						$this->newWidth = round($s_width*$resize_pc);
				} else {
					$resize_pc = ($this->newWidth/$s_width);
					// make sure the new dimensions fit into defined space
					if(round($s_height*$resize_pc)<=$this->newHeight) {
						$this->newHeight = round($s_height*$resize_pc);
					} else {
						$resize_pc = ($this->newHeight/$s_height);
						$this->newWidth = round($s_width*$resize_pc);
					}
				}
			} else { 
				if($this->oversize=='true') { // resize to fill the frame - oversized images
					$resize_pc = ($this->newWidth/$s_width);
					$this->newHeight = round($s_height*$resize_pc);
				} else {
					$resize_pc = ($this->newHeight/$s_height);
					// make sure the new dimensions fit into defined space
					if(round($s_width*$resize_pc)<=$this->newWidth) {
						$this->newWidth = round($s_width*$resize_pc);
					} else {
						$resize_pc = ($this->newWidth/$s_width);
						$this->newHeight = round($s_height*$resize_pc);
					}
				}
			} 
		}
		
		if($this->padToFit!='true') { // if padding not required then set canvas size to new image size aspect
			$c_width = $this->newWidth;
			$c_height = $this->newHeight;
		} 
		
		if($this->upscale!='true'){
			// do not upscale image
			if(($s_width<=$this->newWidth)&&($s_height<=$this->newHeight)) {
				$this->newWidth = $s_width;
				$this->newHeight = $s_height;
			}
		}
		 
		
		// set the position of source in the canvas
		if($this->padToFit=='true') {
			// set positions
			$top = $left = 0;
			$right = $c_width-$this->newWidth;
			$cenX = ($c_width/2)-($this->newWidth/2);
			$cenY = ($c_height/2)-($this->newHeight/2);
			$bottom = $c_height-$this->newHeight;
			switch(true) {
				case (strstr($this->setPosition,',')): // pixel x,y entered
					$dim = explode($this->setPosition,',');
					$x = intval(@$dim[0]);
					$y = intval(@$dim[1]);
					$toPos = array('dx'=>$x,'dy'=>$y,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='tl'): // top left
					$toPos = array('dx'=>$left,'dy'=>$top,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='tr'): // top right
					$toPos = array('dx'=>$right,'dy'=>$top,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='tc'): // top centre
					$toPos = array('dx'=>$cenX,'dy'=>$top,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='bl'): // bottom left
					$toPos = array('dx'=>$left,'dy'=>$bottom,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='br'): // bottom right
					$toPos = array('dx'=>$right,'dy'=>$bottom,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='bc'): // bottom centre
					$toPos = array('dx'=>$cenX,'dy'=>$bottom,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='cl'): // centre left
					$toPos = array('dx'=>$left,'dy'=>$cenY,'sx'=>0,'sy'=>0); break;
				case ($this->setPosition=='cr'): // centre right
					$toPos = array('dx'=>$right,'dy'=>$cenY,'sx'=>0,'sy'=>0); break;
				default: // centred horz + vert
					$toPos = array('dx'=>$cenX,'dy'=>$cenY,'sx'=>0,'sy'=>0); break;
			}
		} else {
			$toPos = array('dx'=>0,'dy'=>0,'sx'=>0,'sy'=>0);
		}
		
		// Create target image
		$canvas = imagecreatetruecolor($c_width, $c_height);
		
		// colour the canvas
		if($this->padColour=='transparent')  {
			$trans_colour = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
			imagefill($canvas, 0, 0, $trans_colour);
			imagealphablending($canvas, true);
			imagesavealpha($canvas, true);
		} else {
			$col = $this->hex2dec($this->padColour);
			$bgCol = imagecolorallocate($canvas, $col['r'], $col['g'], $col['b']);
			imagefill($canvas, 0, 0, $bgCol);
		}

		// Copy image
		imagecopyresampled($canvas, $src, $toPos['dx'], $toPos['dy'], $toPos['sx'], $toPos['sy'], $this->newWidth, $this->newHeight, $s_width, $s_height);
		
		// Output
		if($this->padColour=='transparent')  {
			switch($this->imgType) {
				case 'gif': $newImg = imagegif($canvas, $path.$preFix.$imgName);
				default: 	
					$quality = (intval($this->imgQuality) > 90) ? 9 : round(intval($this->imgQuality)/10);
					//imagealphablending($canvas, false);
					//imagesavealpha($canvas, true);
					$newImg = imagepng($canvas, $path.$preFix.$imgName, $quality);
					
			}
		} else {
			switch($this->imgType) {
				case 'gif': 	$newImg = imagejpeg($canvas, $path.$preFix.$imgName, $this->imgQuality);
				case 'png':
					$quality = (intval($this->imgQuality) > 90) ? 9 : round(intval($this->imgQuality)/10);
					//imagealphablending($canvas, false);
					//imagesavealpha($canvas, true);
					$newImg = imagepng($canvas, $path.$preFix.$imgName,$quality);
				case 'wbmp': 	$newImg = imagewbmp($canvas, $path.$preFix.$imgName);
				default: 		$newImg = imagejpeg($canvas, $path.$preFix.$imgName, $this->imgQuality);
			}
		}
		
		// clean up
		imagedestroy($src);
		imagedestroy($canvas);
		
		// Return image, array or blob if required
		switch(strtolower($this->returnType)) {
			case 'array': 
				$_ar = array(
					'image' 	=> $imgName,
					'prefix'	=> $preFix,
					'path'		=> $path,
					'height'	=> $c_height,
					'width'		=> $c_width,
					'bgcolor'	=> $this->padColour
				);
				return $_ar; break;
			case 'fullpath':
				return (file_exists($path.$preFix.$imgName)) ? $path.$preFix.$imgName : false; break;
			case 'blob':
				if(file_exists($path.$preFix.$imgName)) {
					$fo = fopen($path.$preFix.$imgName, 'r');
					$blob = mysql_real_escape_string(fread($fo, filesize($path.$preFix.$imgName)));
					fclose($fo);
					return $blob; break;
				} else { return false; break; }
			default:
				return (file_exists($path.$preFix.$imgName)) ? true : false; break;
		}
	}

	#######################################################
	#
	#		EXTRA IMAGE METHODS
	#
	#######################################################
	
	public function get_image_width($img) {
		if(file_exists($img)) {
			list($width, $height) = getimagesize($img);
			return $width;
		} else {
			return 0;
		}
	}
	
	public function get_image_height($img) {
		if(file_exists($img)) {
			list($width, $height) = getimagesize($img);
			return $height;
		} else {
			return 0;
		}
	}
	
	public function get_image_size($img) {
		if(file_exists($img)) {
			list($width, $height) = getimagesize($img);
			return array('width'=>$width,'height'=>$height);
		} else {
			return array('width'=>0,'height'=>0);
		}
	}
	
	public function doDie($msg,$file="",$line="") { 					// doDie - calls a die function with custom error
		if (($file!='')&&($line!='')) {
		return(	'<h4>Error:</h4>'.$msg.'<br/><br/>'.
		 		'<strong>File:</strong> '.$file.
				' - <strong>on line:</strong> '.$line.
				'</body></html>');
		} else {
		return(	$msg);
		}
	}
} 