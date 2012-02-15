<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->database();
		//$this->load->library('session');
		//$this->load->model('api');
		$this->load->model('email_model');
		$this->load->model('pass_recover_model');
	}
	
	public function index()	{
		$this->load->view('welcome_message');
	}
	
	
	public function login() {
		$email=addslashes($_REQUEST['email']);
		$pass=md5(md5(addslashes($_REQUEST['pass'])));
		$result = $this->db->query('SELECT b.* FROM users a, profile_data b
										WHERE a.prof_id=b.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
									UNION
									SELECT  b.* FROM users a, profile_data b
										WHERE b.user_id=a.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
								');
		$db_result = $result->result();
		$json->action = "login";
		$json->status = "1";
		$json->id=$db_result[0]->id;
		foreach ($db_result as $value){
			$tree[$value->id]->l_name=$value->l_name;
			$tree[$value->id]->f_name=$value->f_name;
			$tree[$value->id]->f_id=$value->f_id;
			$tree[$value->id]->m_id=$value->m_id;
			$tree[$value->id]->ch_ids=$value->ch_ids;
			$tree[$value->id]->spouse_id=$value->spouse_id;
			$tree[$value->id]->b_date=$value->b_date;
			$tree[$value->id]->d_date=$value->d_date;
			$tree[$value->id]->sex=$value->sex;
			$tree[$value->id]->photo_url=$value->photo_url;
			$tree[$value->id]->comment=$value->comment;
		}	
		$json->tree=$tree;
		echo json_encode($json);
	}
	
	public function reg() {
		$email=addslashes($_REQUEST['email']);
		$pass=md5(md5(addslashes($_REQUEST['pass'])));
		$res = $this->db->query('SELECT * FROM users	WHERE email="'.$email.'" AND pass="'.$pass.'"');
		if(!$res->result()){
			$result = $this->db->query('INSERT INTO users(`id`, `prof_id`, `email`, `pass`)
										VALUES ("", "", "'.$email.'", "'.$pass.'")	
										');
			$json->action = "registration";
			$json->status = "1";
			echo json_encode($json);
			$this->email_model->send($email, 'Family Tree Registration', 'Thanks for registration');
		} else {
			$json->action = "registration";
			$json->status = "0";
			echo json_encode($json);
		}
	}
	
	public function pass_recover() {
		$email = addslashes($_REQUEST['email']);
		$pass = $this->pass_recover_model->random_password();
		$this->email_model->send($email, 'Family Tree Password Recover', 'Your new password is '.$pass);
		$this->db->query('UPDATE `users` SET `pass`= "'.md5(md5($pass)).'" WHERE email="'.$email.'"');
		$json->action = "recover";
		$json->status = "1";
		echo json_encode($json);
	}
}