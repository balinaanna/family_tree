<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->library('session');
		//$this->load->model('api');
		$this->load->model('email_model');
		$this->load->model('pass_recover_model');
	}
	
	public function index()	{
		$json->action = "index.html";
		$json->status = "0";
		$json->message = "no action";
		echo json_encode($json);
	}
	
	
	public function login() {
		$email=addslashes($_REQUEST['email']);
		$pass=md5(md5(addslashes($_REQUEST['pass'])));
		$autologin=addslashes(base64_decode($_REQUEST['autologin']));
		if(!$pass){$pass=$autologin;}
		$result = $this->db->query('SELECT b.*, a.pass, a.id as user_id FROM users a, profile_data b
										WHERE a.prof_id=b.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
								UNION
								SELECT  b.*, a.pass, a.id as user_id FROM users a, profile_data b
										WHERE b.user_id=a.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
							    ');
		$db_result = $result->result();
		if($db_result) {
			$json->action = "login";
			$json->status = "1";
			$json->id=$db_result[0]->id;
			$json->pass=base64_encode($db_result[0]->pass);
			
			$session_data = array(
			    'user_id'     => $db_result[0]->user_id,
			    'prof_id'  => $json->id,
			    'pass'     => $db_result[0]->pass
			);
			$this->session->set_userdata($session_data);
			
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
		} else {
			$json->action = "login";
			$json->status = "0";
			$json->message = "login error";
		}
		echo json_encode($json);
	}
	
	public function reg() {
		$email=addslashes($_REQUEST['email']);
		if( $this->email_model->is_valid_email($email) == false ) {
		    $json->action = "registration";
		    $json->status = "0";
		    $json->message = "invalid email";
		    echo json_encode($json);
		    die();
		}
		$pass=md5(md5(addslashes($_REQUEST['pass'])));
		if(trim($pass)==""){
		    $json->action = "registration";
		    $json->status = "0";
		    $json->message = "no pass";
		    echo json_encode($json);
		    die();
		}
		$res = $this->db->query('SELECT * FROM users WHERE email="'.$email.'"');
		if(!$res->result()){
			$result = $this->db->query('INSERT INTO users(`id`, `prof_id`, `email`, `pass`)
										VALUES ("", "", "'.$email.'", "'.$pass.'")	
								    ');
			$json->action = "registration";
			$json->status = "1";
			$this->email_model->send($email, 'Family Tree Registration', 'Thanks for registration');
		} else {
			$json->action = "registration";
			$json->status = "0";
			$json->message = "email already exists";
		}
		echo json_encode($json);
	}
	
	public function pass_recover() {
		$email = addslashes($_REQUEST['email']);
		$res = $this->db->query('SELECT * FROM users WHERE email="'.$email.'"');
		if(!$res){
			$json->action = "pass_recover";
			$json->status = "0";
			$json->message = "User not found";
		} else {
			$pass = $this->pass_recover_model->random_password();
			$this->email_model->send($email, 'Family Tree Password Recover', 'Your new password is '.$pass);
			$this->db->query('UPDATE `users` SET `pass`= "'.md5(md5($pass)).'" WHERE email="'.$email.'"');
			$json->action = "recover";
			$json->status = "1";
		}
		echo json_encode($json);
	}
	
	public function save_node() {
	    //$json_response='{"1":{"l_name":"ffff","b_date":"123","d_date":"456","f_id":"2","m_id":"3","about":"Lorem ipsum dolor sit amet..."}}';
	    $data = (array)json_decode($json_response);
	    foreach($data as $key => $value){
		$this->db->query('UPDATE `profile_data` SET  `f_id`= "'.$value->f_id.'",
											    `m_id`= "'.$value->m_id.'",
											    `ch_ids`= "'.$value->ch_ids.'",
											    `spouse_id`= "'.$value->spouse_id.'",
											    `f_name`= "'.$value->f_name.'",
											    `l_name`= "'.$value->l_name.'",
											    `b_date`= "'.$value->b_date.'",
											    `d_date`= "'.$value->d_date.'",
											    `sex`= "'.$value->sex.'",
											    `photo_url`= "'.$value->photo_url.'",
											    `comment`= "'.$value->comment.'"
						    WHERE `id`="'.$key.'" AND
							       `user_id`="'.$this->session->userdata('user_id').'"
					    ');
	    }
	    $json->action = "save_node";
	    $json->status = "1";
	    echo json_encode($json);
	}
	
	public function add_node() {
	    //$json_response='{"l_name":"ffff","b_date":"123","d_date":"456","f_id":"2","m_id":"3","about":"Lorem ipsum dolor sit amet..."}};
	    $value = json_decode($json_response);
	    $this->db->query('INSERT INTO `profile_data`(`user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    	"'.$this->session->userdata('user_id').'",
						"'.$value->f_id.'",
					    	"'.$value->m_id.'",
						"'.$value->ch_ids.'",
						"'.$value->spouse_id.'",
						"'.$value->f_name.'",
						"'.$value->l_name.'",
						"'.$value->b_date.'",
						"'.$value->d_date.'",
						"'.$value->sex.'",
						"'.$value->photo_url.'",
						"'.$value->comment.'"
					    ');
	    $json->action = "add_node";
	    $json->status = "1";
	    echo json_encode($json);
	}
	
	public function delete_node() {
	    //$json_response='{"id":"5"}';
	    $value = json_decode($json_response);
	    $this->db->query('DELETE FROM `profile_data`
						WHERE `id` = "'.$value->id.'" AND
							    `user_id` = "'.$this->session->userdata('user_id').'"
					    ');
	    $json->action = "delete_node";
	    $json->status = "1";
	    echo json_encode($json);
	}
}