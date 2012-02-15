<?php
class Image_model extends CI_Model {

	private $max_size = 200;

	private function getExtension($str) {
		$i = strrpos($str,".");
		if (!$i) { return ""; }
		$l = strlen($str) - $i;
		$ext = substr($str,$i+1,$l);
		return $ext;
	}
	
	public function save_image($photo, $id) {
		$image=$photo['name'];
		if ($image) {
			$extension = strtolower($this->getExtension(stripslashes($image)));
			if (($extension != "jpg") && ($extension != "jpeg") && ($extension != "png") && ($extension != "gif")) {
				$json->action = "image_upload";
				$json->status = "0";
				$json->message = "Unknown extension";
				return json_encode($json);
			}
			else	{
				$size=filesize($photo['tmp_name']);
				if ($size > $this->max_size*1024){
					$json->action = "image_upload";
					$json->status = "0";
					$json->message = "Size limit";
					return json_encode($json);
				}
				$image_name=$id.'.'.$extension;
				$newname="images/".$image_name;
				$copied = copy($photo['tmp_name'], $newname);
				if (!$copied) {
					$json->action = "image_upload";
					$json->status = "0";
					$json->message = "Copy unsuccessfull";
					return json_encode($json);
				}
			}
		}
	}

}