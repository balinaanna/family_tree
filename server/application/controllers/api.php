<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->library('session');
		$this->load->helper('email');
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
				$tree[$key]->comment=stripslashes($value->comment);
				//$tree1[] = $tree;
			}
		//print_r($tree);
		echo json_encode($tree);	
	}

	public function login() {
		$email=addslashes($_REQUEST['email']);
		if(isset($_REQUEST['pass'])){$pass=md5(md5(addslashes($_REQUEST['pass'])));}
		elseif(isset($_REQUEST['autologin'])){$pass=addslashes($_REQUEST['autologin']);}
		else {$pass="";}
		/*
		$result = $this->db->query('SELECT b.*, a.pass, a.id as user_id FROM users a, profile_data b
										WHERE a.prof_id=b.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
									UNION
									SELECT  b.*, a.pass, a.id as user_id FROM users a, profile_data b
										WHERE b.user_id=a.id AND a.email="'.$email.'" AND a.pass="'.$pass.'"
							    ');
		*/
		$result = $this->db->query('SELECT a.pass, a.id as user_id, a.prof_id FROM users a
										WHERE a.email="'.$email.'" AND a.pass="'.$pass.'"
										LIMIT 1
							    ');
		$db_result = $result->result();
		if($db_result) {
			$json->action = "login";
			$json->status = "1";
			$json->id = $db_result[0]->user_id;
			$json->prof_id = $db_result[0]->prof_id;
			$json->email = $email;
			$json->autologin = $pass;

			$session_data = array(
			    'user_id'  => $db_result[0]->user_id,
			    'pass'     => $db_result[0]->pass,
				'prof_id' => $db_result[0]->prof_id
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
		if( valid_email($email) == false ) {
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
		@$f_name = addslashes($_REQUEST['f_name']);
		@$l_name = addslashes($_REQUEST['l_name']);
		@$b_date = addslashes($_REQUEST['b_date']);
		@$sex = addslashes($_REQUEST['sex']);
		$res = $this->db->query('SELECT * FROM users WHERE email="'.$email.'"');
		if(!$res->result()){
			$result = $this->db->query('INSERT INTO users(`id`, `prof_id`, `email`, `pass`)
										VALUES ("", "", "'.$email.'", "'.$pass.'")	
								    ');
			$result = $this->db->query('SELECT a.id as user_id FROM users a
										WHERE a.email="'.$email.'" AND a.pass="'.$pass.'"
							    	');
			$db_result = $result->result();
			$this->db->query('INSERT INTO `profile_data`(`user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    	VALUES (
					    			"'.$db_result[0]->user_id.'",
									"",
							    	"",
									"'.json_encode(array()).'",
									"",
									"'.$f_name.'",
									"'.$l_name.'",
									"'.$b_date.'",
									"",
									"'.$sex.'",
									"",
									""
								)');
			$this->db->query('UPDATE `users` SET `prof_id`=(SELECT `id` FROM `profile_data` WHERE `user_id`="'.$db_result[0]->user_id.'" LIMIT 1) WHERE email="'.$email.'"');		    	
			$json->action = "registration";
			$json->status = "1";
			$json->message = "Registration successful";
			mail($email, 'Family Tree Registration', 'Thanks for registration');
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
			mail($email, 'Family Tree Password Recover', 'Your new password is '.$pass);
			$this->db->query('UPDATE `users` SET `pass`= "'.md5(md5($pass)).'" WHERE email="'.$email.'"');
			$json->action = "recover";
			$json->status = "1";
		}
		echo json_encode($json);
	}

	public function save_node() {
		if(!isset($_REQUEST['ch_ids'])){$_REQUEST['ch_ids']= array();}
		if(!isset($_REQUEST['f_id'])){$_REQUEST['f_id']='';}
		if(!isset($_REQUEST['m_id'])){$_REQUEST['m_id']='';}
		if(!isset($_REQUEST['spouse_id'])){$_REQUEST['spouse_id']='';}
		if(!isset($_REQUEST['f_name'])){$_REQUEST['f_name']='';}
		if(!isset($_REQUEST['l_name'])){$_REQUEST['l_name']='';}
		if(!isset($_REQUEST['b_date'])){$_REQUEST['b_date']='';}
		if(!isset($_REQUEST['d_date'])){$_REQUEST['d_date']='';}
		if(!isset($_REQUEST['sex'])){$_REQUEST['sex']='m';}
		if(!isset($_REQUEST['comment'])){$_REQUEST['comment']='';}
	    $value = (object)$_REQUEST;
	    $photo = ($value->photo_url) ? pathinfo($value->photo_url) : array('basename' => 'no_avatar.jpg');
		$this->db->query('UPDATE `profile_data` SET  `f_id`= "'.$value->f_id.'",
											    `m_id`= "'.$value->m_id.'",
											    `ch_ids`= "'.addslashes(json_encode($value->ch_ids)).'",
											    `spouse_id`= "'.$value->spouse_id.'",
											    `f_name`= "'.$value->f_name.'",
											    `l_name`= "'.$value->l_name.'",
											    `b_date`= "'.$value->b_date.'",
											    `d_date`= "'.$value->d_date.'",
											    `sex`= "'.$value->sex.'",
											    `photo_url`= "'.$photo['basename'].'",
											    `comment`= "'.addslashes($value->comment).'"
						    WHERE `id`="'.$value->id.'" AND
							       `user_id`="'.$this->session->userdata('user_id').'"
					    ');
		if(!isset($value->crop)){$value->crop=0;}
		if($value->crop) {
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
	    $json->action = "save_node";
	    $json->status = "1";
	    echo json_encode($json);
	}

	public function add_node() {
		if(!isset($_REQUEST['ch_ids'])){$_REQUEST['ch_ids']= array();}
		if(!isset($_REQUEST['f_id'])){$_REQUEST['f_id']='';}
		if(!isset($_REQUEST['m_id'])){$_REQUEST['m_id']='';}
		if(!isset($_REQUEST['spouse_id'])){$_REQUEST['spouse_id']='';}
		if(!isset($_REQUEST['f_name'])){$_REQUEST['f_name']='';}
		if(!isset($_REQUEST['l_name'])){$_REQUEST['l_name']='';}
		if(!isset($_REQUEST['b_date'])){$_REQUEST['b_date']='';}
		if(!isset($_REQUEST['d_date'])){$_REQUEST['d_date']='';}
		if(!isset($_REQUEST['sex'])){$_REQUEST['sex']='m';}
		if(!isset($_REQUEST['comment'])){$_REQUEST['comment']='';}
		$value = (object)$_REQUEST;
	    $photo = (isset($value->upload)) ? pathinfo($value->photo_url) : array('basename' => 'no_avatar.jpg');
	    $this->db->query('INSERT INTO `profile_data`(`user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    		"'.$this->session->userdata('user_id').'",
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
								"'.addslashes($value->comment).'"
							);
						');
		$lastid = $this->db->query('SELECT * FROM `profile_data` 
									WHERE `user_id` = "'.$this->session->userdata('user_id').'"
									ORDER BY `id` DESC LIMIT 1;
					    		');
		$last_id = $lastid->result();
		$last_id = $last_id[0];
		// Street Magic
		switch($value->action) {
			case 'add_child':
				if($value->f_id){
					$ch_ids=$this->db->query('SELECT ch_ids FROM `profile_data` WHERE id='.$value->f_id);
					$ch_ids=$ch_ids->result();
					$ch_ids=json_decode($ch_ids[0]->ch_ids);
					$ch_ids[]=$last_id->id;
					$ch_ids = json_encode($ch_ids);
					if($value->m_id){
						$this->db->query('UPDATE `profile_data` SET `ch_ids`="'.addslashes($ch_ids).'" WHERE id IN('.$value->f_id.', '.$value->m_id.')');
					} else {
						$this->db->query('INSERT INTO `profile_data`(`user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    		"'.$this->session->userdata('user_id').'",
								"",
							    "",
								"'.addslashes($ch_ids).'",
								"'.$value->f_id.'",
								"?",
								"?",
								"?",
								"?",
								"f",
								"no_avatar.jpg",
								""
							);
						');
						$last_mid = $this->db->query('SELECT * FROM `profile_data` 
									WHERE `user_id` = "'.$this->session->userdata('user_id').'"
									ORDER BY `id` DESC LIMIT 1;
					    		');
						$last_m_id = $last_mid->result();
						$last_m_id = $last_m_id[0];
						$this->db->query('UPDATE `profile_data` SET `spouse_id`="'.$last_m_id->id.'", `ch_ids`="'.addslashes($ch_ids).'" WHERE id="'.$value->f_id.'"');
						$this->db->query('UPDATE `profile_data` SET `m_id`="'.$last_m_id->id.'" WHERE id="'.$last_id->id.'"');
					}
				}
				if($value->m_id){
					$ch_ids=$this->db->query('SELECT ch_ids FROM `profile_data` WHERE id='.$value->m_id);
					$ch_ids=$ch_ids->result();
					$ch_ids=json_decode($ch_ids[0]->ch_ids);
					$ch_ids[]=$last_id->id;
					$ch_ids = json_encode($ch_ids);
					if(!$value->f_id){
						$this->db->query('INSERT INTO `profile_data`(`user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    		"'.$this->session->userdata('user_id').'",
								"",
							    "",
								"'.addslashes($ch_ids).'",
								"'.$value->m_id.'",
								"?",
								"?",
								"?",
								"?",
								"m",
								"no_avatar.jpg",
								""
							);
						');
						$last_fid = $this->db->query('SELECT * FROM `profile_data` 
									WHERE `user_id` = "'.$this->session->userdata('user_id').'"
									ORDER BY `id` DESC LIMIT 1;
					    		');
						$last_f_id = $last_fid->result();
						$last_f_id = $last_f_id[0];
						$this->db->query('UPDATE `profile_data` SET `spouse_id`="'.$last_f_id->id.'", `ch_ids`="'.addslashes($ch_ids).'" WHERE id="'.$value->m_id.'"');
						$this->db->query('UPDATE `profile_data` SET `f_id`="'.$last_f_id->id.'" WHERE id="'.$last_id->id.'"');
					}
				}
			break;

			case 'add_parent':
				if($value->sex =="m"){
					$this->db->query('INSERT INTO `profile_data`(`user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    		"'.$this->session->userdata('user_id').'",
								"",
							    "",
								"'.addslashes(json_encode($value->ch_ids)).'",
								"'.$last_id->id.'",
								"?",
								"?",
								"?",
								"?",
								"f",
								"no_avatar.jpg",
								""
							);
						');
					$last_sid = $this->db->query('SELECT * FROM `profile_data` WHERE `user_id` = "'.$this->session->userdata('user_id').'" ORDER BY `id` DESC LIMIT 1');
					$last_s_id = $last_sid->result();
					$last_s_id = $last_s_id[0];
					$this->db->query('UPDATE `profile_data` SET `spouse_id`="'.$last_s_id->id.'" WHERE id='.$last_id->id);
					$this->db->query('UPDATE `profile_data` SET `f_id`="'.$last_id->id.'", `m_id`="'.$last_s_id->id.'" WHERE id='.$value->send_node_id);
				}
				if($value->sex =="f"){
					$this->db->query('INSERT INTO `profile_data`(`user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`)
				    	    VALUES (
					    		"'.$this->session->userdata('user_id').'",
								"",
							    "",
								"'.addslashes(json_encode($value->ch_ids)).'",
								"'.$last_id->id.'",
								"?",
								"?",
								"?",
								"?",
								"m",
								"no_avatar.jpg",
								""
							);
						');
					$last_sid = $this->db->query('SELECT * FROM `profile_data` WHERE `user_id` = "'.$this->session->userdata('user_id').'" ORDER BY `id` DESC LIMIT 1');
					$last_s_id = $last_sid->result();
					$last_s_id = $last_s_id[0];
					$this->db->query('UPDATE `profile_data` SET `spouse_id`="'.$last_s_id->id.'" WHERE id='.$last_id->id);
					$this->db->query('UPDATE `profile_data` SET `m_id`="'.$last_id->id.'", `f_id`="'.$last_s_id->id.'" WHERE id='.$value->send_node_id);
				}
			break;

			case 'add_spouse':
				$this->db->query('UPDATE `profile_data` SET `spouse_id`="'.$last_id->id.'" WHERE id='.$last_id->spouse_id);
			break;
		}
		if(!isset($value->upload)){$value->upload=0;}
		if(!isset($value->upload)) { // If UPLOAD ( save_photo() ) return success

			rename(BASEPATH."../..".$value->photo_url, BASEPATH."../../assets/images/uploaded/avatars/".$last_id->id.".".$photo['extension']);
			$value->photo_url = "../assets/images/uploaded/avatars/".$last_id->id.".".$photo['extension'];
			$this->db->query('UPDATE `profile_data`
								SET `photo_url`= "'.$last_id->id.".".$photo['extension'].'"
						    	WHERE `id`="'.$last_id->id.'" AND
							       	  `user_id`="'.$this->session->userdata('user_id').'"
					    	');
			// CUSTOM WIDTH && HEIGHT !!!!
			$image = $this->image_model;
			$image->source_file = BASEPATH."../".$value->photo_url;
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
		$json->addnode = $last_id;
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