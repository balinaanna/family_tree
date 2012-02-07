<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	public function index()
	{
		$this->load->view('welcome_message');
	}
	
	
	public function login() {
		$s = file_get_contents('http://ulogin.ru/token.php?token=' . $_POST['token'] . '&host=' . $_SERVER['HTTP_HOST']);
		$user = json_decode($s, true);
		//$user['network'] - соц. сеть, через которую авторизовался пользователь
		//$user['identity'] - уникальная строка определяющая конкретного пользователя соц. сети
		//$user['first_name'] - имя пользователя
		//$user['last_name'] - фамилия пользователя
		echo "Network:".$user['network']." ".$user['identity']." ".$user['first_name']." ".$user['last_name'];
	}
	
}