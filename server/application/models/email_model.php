<?php
class Email_model extends CI_Model {

	public function __construct() {
		$this -> load -> library('email');
	}

	function send($email, $subject, $message) {
		$this -> email -> from('family_tree@gmail.com', 'Family Tree Project');
		$this -> email -> to($email);
		$this -> email -> subject($subject);
		$this -> email -> message($message);
		$result = $this -> email -> send();
		return $result;
	}
}