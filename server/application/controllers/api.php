<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->library('session');
		//$this->load->model('api');
		$this->load->model('email_model');
		$this->load->model('pass_recover_model');
		$this->load->model('image_model');
	}
	
	public function index()	{
		if($this->session->userdata('user_id')){
			$json->action = "index.html";
			$json->status = "1";
			$json->message = "no action";
		}else{
			$json->action = "index.html";
			$json->status = "0";
			$json->message = "no action";
		}
		echo json_encode($json);
	}
	
	public function logout(){
		$this->session->sess_destroy();
	}
	
	public function get_tree() {		
		$result = $this->db->query('SELECT  b.* FROM profile_data b
										WHERE b.user_id="'.$this->session->userdata('user_id').'"
										ORDER BY b.id
							    ');
		$db_result = $result->result();

		$session_data = array('prof_id'  => $db_result[0]->user_id);
		$this->session->set_userdata($session_data);

		//echo json_encode($db_result);
		$tree1 = array();
		foreach ($db_result as $key => $value){
				$tree[$key]->id=$value->id;
				$tree[$key]->l_name=$value->l_name;
				$tree[$key]->f_name=$value->f_name;
				$tree[$key]->f_id=$value->f_id;
				$tree[$key]->m_id=$value->m_id;
				$tree[$key]->ch_ids=json_decode(stripslashes($value->ch_ids));
				$tree[$key]->spouse_id=$value->spouse_id;
				$tree[$key]->b_date=$value->b_date;
				$tree[$key]->d_date=$value->d_date;
				$tree[$key]->sex=$value->sex;
				$tree[$key]->photo_url=$value->photo_url;
				$tree[$key]->comment=$value->comment;
				//$tree1[] = $tree;
			}
		//print_r($tree);
		echo json_encode($tree);	
	}
	
	public function login() {
		$email=addslashes($_REQUEST['email']);
		$pass=md5(md5(addslashes($_REQUEST['pass'])));
		if(isset($_REQUEST['autologin'])){$autologin=addslashes(base64_decode($_REQUEST['autologin']));}
		if(!$pass){$pass=$autologin;}
		/*
		$result = $this->db->query('SELECT b.*, a.pass, a.id as user_id FROM users a, profile_data b
										WHERE a.prof_id=b.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
									UNION
									SELECT  b.*, a.pass, a.id as user_id FROM users a, profile_data b
										WHERE b.user_id=a.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
							    ');
		*/
		$result = $this->db->query('SELECT a.pass, a.id as user_id FROM users a
										WHERE a.email="'.$email.'" AND a.pass="'.$pass.'"
										LIMIT 1
							    ');
		$db_result = $result->result();
		if($db_result) {
			$json->action = "login";
			$json->status = "1";
			$json->id=$db_result[0]->user_id;
			$json->pass=base64_encode($db_result[0]->pass);
			
			$session_data = array(
			    'user_id'  => $db_result[0]->user_id,
			    //'prof_id'  => $json->id,
			    'pass'     => $db_result[0]->pass
			);
			$this->session->set_userdata($session_data);
			
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
			$result = $this->db->query('SELECT a.id as user_id FROM users a
										WHERE a.email="'.$email.'" AND a.pass="'.$pass.'"
							    	');
			$db_result = $result->result();
			$this->db->query('INSERT INTO `profile_data`(`user_id`, `id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    		"'.$db_result[0]->user_id.'",
					    		"1",
								"",
							    "",
								"[]",
								"",
								"",
								"",
								"",
								"",
								"",
								"",
								""
							)
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
	    $value = (object)$_REQUEST;
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
						    WHERE `id`="'.$value->user_id.'" AND
							       `user_id`="'.$this->session->userdata('user_id').'"
					    ');
		if($value->crop) {
			$json->crop = $this->crop_photo();
		}
	    $json->action = "save_node";
	    $json->status = "1";
	    echo json_encode($json);
	}
	
	public function add_node() {
	    $value = (object)$_REQUEST;
	    $photo = ($value->upload) ? pathinfo($value->photo_url) : array('basename' => 0);
	    $last_id = $this->db->query('INSERT INTO `profile_data`(`user_id`, `id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    		"'.$this->session->userdata('user_id').'",
					    		"'.$value->id.'",
								"'.$value->f_id.'",
							    "'.$value->m_id.'",
								"'.addslashes(json_encode($value->ch_ids)).'",
								"'.$value->spouse_id.'",
								"'.$value->f_name.'",
								"'.$value->l_name.'",
								"'.$value->b_date.'",
								"'.$value->d_date.'",
								"'.$value->sex.'",
								"'.$photo['basename'].'",
								"'.$value->comment.'"
							);
							SELECT * FROM `profile_data` 
								WHERE `user_id` = "'.$this->session->userdata('user_id').'"" 
								ORDER BY id DESC 
								LIMIT 1;
					    ');
		$last_id = $last_id->result();
		if($value->upload) { // If UPLOAD ( save_photo() ) return success
			rename("..".$value->photo_url, "../assets/images/uploaded/avatars/".$last_id->id.$photo['extension']);
			$value->photo_url = "../assets/images/uploaded/avatars/".$last_id->id.$photo['extension'];
			$this->db->query('UPDATE `profile_data`
								SET `photo_url`= "'.$last_id->id.$photo['extension'].'"
						    	WHERE `id`="'.$last_id->id.'" AND
							       	  `user_id`="'.$this->session->userdata('user_id').'"
					    	');
			// CUSTOM WIDTH && HEIGHT !!!!

			$image = $this->image_model;
			$image->source_file = "../".$value->photo_url;
			$image->returnType = 'array';
			$value->x1 = (-1)*ceil($value->x1);	
	  		$value->y1 = (-1)*ceil($value->y1);
			$width = 300;
			$height = 300;
			$img = $image->crop($width, $height, $value->x1, $value->y1);

			$crop->action = "crop_photo";
	    	$crop->status = "1";
	    	$crop->response = $img['image'];
	    	$json->crop = $crop;
		}
	    $json->action = "add_node";
	    $json->status = "1";
	    echo json_encode($json);
	}
	
	public function delete_node() {
	    $value->id = $_REQUEST['id'];
	    $this->db->query('DELETE FROM `profile_data`
							WHERE `id` = "'.$value->id.'" AND
							   	`user_id` = "'.$this->session->userdata('user_id').'"
					    ');
	    $json->action = "delete_node";
	    $json->status = "1";
	    echo json_encode($json);
	}

	public function save_photo() {
		$value = (object)$_REQUEST; // ?
		$image = $this->image_model;
		$image->returnType = 'array';
		$image->newName = ($value->user_id) ? $value->user_id : $this->session->userdata('user_id')."_temp";
		$img = $image->upload($_FILES['Filedata']);

		$json->action = "save_photo";
	    $json->status = "1";
	    $json->response = $img['image']; 
	    echo json_encode($json);
	}

}