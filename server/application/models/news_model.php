<?php
class News_model extends CI_Model {

	public function __construct() {
		$this -> load -> database();
	}

	public function get_news($id = FALSE) {
		if ($id === FALSE) {
			$query = $this -> db -> get('news');
			return $query -> result_array();
		}

		$query = $this -> db -> get_where('news', array('id' => $id));
		return $query -> row_array();
	}
	
	public function get_news_10($count = 0) {
		
		//$rowCount = $this->db->count_all('news');
		//$query = $this -> db -> get('news',2,$rowCount - 2 - $count);
		$this->db->order_by("id", "desc");
		$query = $this -> db -> get('news',5,$count);
		return $query -> result_array();
		
	}
	
	public function get_news_all() {
		return $this->db->count_all('news');
	}

	public function set_news() {
		$this -> load -> helper('url');

		$slug = url_title($this -> input -> post('title'), 'dash', TRUE);

		$data = array('title' => $this -> input -> post('title'), 'slug' => $slug, 'text' => $this -> input -> post('text'));

		return $this -> db -> insert('news', $data);
	}

}
