<?php
class Pass_recover_model extends CI_Model {

	public function __construct() {
		//$this -> load -> library('email');
	}

	function random_password() {
		$chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz023456789"; 
		srand((double)microtime()*1000000); 
		$i = 0; 
		$pass = ''; 
		while ($i <= 7) { 
			$num = rand() % 66; 
			$tmp = substr($chars, $num, 1); 
			$pass = $pass . $tmp; 
			$i++; 
		}
    	return $pass;
	} 

}