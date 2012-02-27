<?php
class Email_model extends CI_Model {

	public function __construct() {
		$this->load->library('email');
	}

	function send($email, $subject, $message) {
		/*
		$this->email->from('family_tree@gmail.com', 'Family Tree Project');
		$this->email->to($email);
		$this->email->subject($subject);
		$this->email->message($message);
		$result = $this->email->send();
		return $result;
		*/
		mail($email, $subject, $message);
	}
	
	function is_valid_email($email) {
		$result = true;
		if(!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$", $email)) { $result = false; }
		return $result;
	}
}