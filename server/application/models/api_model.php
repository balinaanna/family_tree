<?php
class Api_model extends CI_Model {

	public function __construct() {
		if (!defined('PHP_EOL')) {
    		switch (strtoupper(substr(PHP_OS, 0, 3))) {
       			 // Windows
        		case 'WIN':
            		define('PHP_EOL', "\r\n");
            	break;

		        // Mac
        		case 'DAR':
            		define('PHP_EOL', "\r");
            		break;

        		// Unix
        		default:
            		define('PHP_EOL', "\n");
    		}
		}
	}

	public function ged_parse($file_path, $last_index) {
		//# init all needed variables
		$anfang   = 0;
		$anfangf  = 0;

		$person   = array();
		$fam      = array();
		$chil     = array();

		$birt     = 0;
		$deat     = 0;
		$chr      = 0;
		$buri     = 0;
		$occu     = 0;
		$conf     = 0;

		$indi     = null;
		$surn     = null;
		$givn     = null;
		$marn     = null;
		$sex      = null;
		$birtplac = null;
		$birtdate = null;
		$deatplac = null;
		$deatdate = null;
		$chrdate  = null;
		$chrplac  = null;
		$buridate = null;
		$buriplac = null;
		$reli     = null;
		$occu2    = null;
		$occudate = null;
		$occuplac = null;
		$confdate = null;
		$confplac = null;
		$note     = null;

		$famlist  = null;
		$marr     = 0;
		$marrdate = null;
		$marrplac = null;
		$famindi  = null;
		$husb     = null;
		$wife     = null;
		//# read file line per line
		$lines = file($file_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		$lines = $this->replaceSpecialChars($lines);
		for ($i = 0; $i < count($lines); $i++) {
			if (preg_match("/0\x20\x40(I.*)\x40/", $lines[$i], $id)) { //# if line starts with 0 @I, a new person is found
				if ($anfang == 1) { //# if next person entry found, write previous to array
					$profile_data[$indi]->l_name=($surn)?$surn:"?";
					$profile_data[$indi]->f_name=($givn?$givn:"?");
					$profile_data[$indi]->sex=($sex)?strtolower($sex):"";
					$profile_data[$indi]->b_date=($birtdate)?$birtdate:"";
					$profile_data[$indi]->d_date=($deatdate)?$deatdate:"";
					array_push($person, $indi.";".$surn.";".$givn.";".$marn.";".$sex.";".$birtdate.";".$birtplac.";".$chrdate.";".$chrplac.";".$deatdate.";".$deatplac.";".$buridate.";".$buriplac.";".$occu2.";".$occudate.";".$occuplac.";".$reli.";".$confdate.";".$confplac.";".$note); // fill person entry data in array
					//# reset variables for to read next entry
					$deat     = 0;
					$chr      = 0;
					$buri     = 0;
					$occu     = 0;
					$conf     = 0;
					$birt     = 0;
					$marr     = 0;

					$indi     = null;
					$surn     = null;
					$givn     = null;
					$marn     = null;
					$sex      = null;
					$birtplac = null;
					$birtdate = null;
					$deatplac = null;
					$deatdate = null;
					$chrdate  = null;
					$chrplac  = null;
					$buridate = null;
					$buriplac = null;
					$reli     = null;
					$occu2    = null;
					$occudate = null;
					$occuplac = null;
					$confdate = null;
					$confplac = null;
					$note     = null;
				} else {

				}
				$indi = $id[1]; //# set indi variable to new value
				$indi = str_replace("\x27", "\xB4", $indi); //# replace ' with ` because of database relevance
				$anfang = 1;
			} else if (preg_match("/2\x20SURN\x20(.*)/", $lines[$i], $surnA)) {   //# read last name
					$surn = str_replace("\x27", "\xB4", $surnA[1]);                    //# replace ' with ` because of database relevance
				} else if (preg_match("/2\x20GIVN\x20(.*)/", $lines[$i], $givnA)) {   //# read first name
					$givn = str_replace("\x27", "\xB4", $givnA[1]);                    //# replace ' with ` because of database relevance
				} else if (preg_match("/1\x20NAME\x20(.*)/", $lines[$i], $nameA)) {   //# read full name
					$full = str_replace("\x27", "\xB4", $nameA[1]);                    //# replace ' with ` because of database relevance
					$tmp  = preg_split("/\//", $full);                                 //# split full name to array
					//# some gedcom software do not have the GIVN and SURN fields. Then this line is usefull. If this two fields are
					//# existing, they overwrite the surn and givn variables again.
					$givn = $tmp[0];                                                   //# read first name from full name
					$surn = $tmp[1];                                                   //# read last name from full name
				} else if (preg_match("/2\x20_MARNM\x20(.*)/", $lines[$i], $marnA)) { //# read marriage name
					$marn = str_replace("\x27", "\xB4", $marnA[1]);                    //# replace ' with ` because of database relevance
				} else if (preg_match("/1\x20SEX\x20(.*)/", $lines[$i], $sexA)) {     //# read sex
					$sex = $sexA[1];
				}else if (preg_match("/1\x20BIRT/", $lines[$i])) { //# start reading birth data
					$deat = 0;
					$chr  = 0;
					$buri = 0;
					$occu = 0;
					$conf = 0;
					$birt = 1;
					$marr = 0;
				} else if (preg_match("/1\x20RESI/", $lines[$i])) { //# dummy because of residence information, at the moment it is ignored
					$deat = 0;
					$chr  = 0;
					$buri = 0;
					$occu = 0;
					$conf = 0;
					$birt = 0;
					$marr = 0;
				} else if (preg_match("/1\x20DEAT/", $lines[$i])) { //# start reading death data
					$birt = 0;
					$chr  = 0;
					$buri = 0;
					$occu = 0;
					$conf = 0;
					$deat = 1;
					$marr = 0;
				} else if (preg_match("/1\x20CHR/", $lines[$i])) { //# start reading christening data
					$birt = 0;
					$deat = 0;
					$chr  = 1;
					$buri = 0;
					$occu = 0;
					$conf = 0;
					$marr = 0;
				} else if (preg_match("/1\x20BURI/", $lines[$i])) { //# start reading burial data
					$birt = 0;
					$deat = 0;
					$chr  = 0;
					$buri = 1;
					$occu = 0;
					$conf = 0;
					$marr = 0;
				}else if (preg_match("/1\x20OCCU\x20(.*)/", $lines[$i], $occu2A)) { //# read occupation data
					$birt = 0;
					$deat = 0;
					$chr  = 0;
					$buri = 0;
					$occu = 1;
					$conf = 0;
					$marr = 0;
					$occu2 = str_replace("\x27", "\xB4", $occu2A[1]); //# replace ' with ` because of database relevance
				} else if (preg_match("/1\x20CONF/", $lines[$i])) {  //# start reading confirmation data
					$birt = 0;
					$deat = 0;
					$chr  = 0;
					$buri = 0;
					$occu = 0;
					$conf = 1;
					$marr = 0;
				} else if (preg_match("/1\x20MARR/", $lines[$i])) {  //# start reading marriage data
					$marr = 1;
				} else if (preg_match("/2\x20DATE\x20(.*)/", $lines[$i], $givenDate)) {  //# read date for...
					if ($birt == 1) {
						$birtdate = $givenDate[1];                                          //# ...birth
						$birtdate = str_replace("\x27", "\xB4", $birtdate);                 //# replace ' with ` because of database relevance
					} if ($deat == 1) {
						$deatdate = $givenDate[1];                                          //# ...death
						$deatdate = str_replace("\x27", "\xB4", $deatdate);                 //# replace ' with ` because of database relevance
					} if ($chr == 1) {
						$chrdate = $givenDate[1];                                           //# ...christening
						$chrdate = str_replace("\x27", "\xB4", $chrdate);                   //# replace ' with ` because of database relevance
					} if ($buri == 1) {
						$buridate = $givenDate[1];                                          //# ...burial
						$buridate = str_replace("\x27", "\xB4", $buridate);                 //# replace ' with ` because of database relevance
					} if ($occu == 1) {
						$occudate = $givenDate[1];                                          //# ...occupation
						$occudate = str_replace("\x27", "\xB4", $occudate);                 //# replace ' with ` because of database relevance
					} if ($conf == 1) {
						$confdate = $givenDate[1];                                          //# ...confirmation
						$confdate = str_replace("\x27", "\xB4", $confdate);                 //# replace ' with ` because of database relevance
					} if ($marr == 1) {
						$marrdate = $givenDate[1];                                          //# ...marriage
						$marrdate = str_replace("\x27", "\xB4", $marrdate);                 //# replace ' with ` because of database relevance
					}
				} else if (preg_match("/2\x20PLAC\x20(.*)/", $lines[$i], $givenPlac)) {  //# read place for...
					if ($birt == 1) {
						$birtplac = $givenPlac[1];                                          //# ...birth
						$birtplac = str_replace("\x27", "\xB4", $birtplac);                 //# replace ' with ` because of database relevance
					} if ($deat == 1) {
						$deatplac = $givenPlac[1];                                          //# ...death
						$deatplac = str_replace("\x27", "\xB4", $deatplac);                 //# replace ' with ` because of database relevance
					} if ($chr == 1) {
						$chrplac = $givenPlac[1];                                           //# ...christening
						$chrplac = str_replace("\x27", "\xB4", $chrplac);                   //# replace ' with ` because of database relevance
					} if ($buri == 1) {
						$buriplac = $givenPlac[1];                                          //# ...burial
						$buriplac = str_replace("\x27", "\xB4", $buriplac);                 //# replace ' with ` because of database relevance
					} if ($occu == 1) {
						$occuplac = $givenPlac[1];                                          //# ...occupation
						$occuplac = str_replace("\x27", "\xB4", $occuplac);                 //# replace ' with ` because of database relevance
					} if ($conf == 1) {
						$confplac = $givenPlac[1];                                          //# ...confirmation
						$confplac = str_replace("\x27", "\xB4", $confplac);                 //# replace ' with ` because of database relevance
					} if ($marr == 1) {
						$marrplac = $givenPlac[1];                                          //# ...marriage
						$marrplac = str_replace("\x27", "\xB4", $marrplac);                 //# replace ' with ` because of database relevance
					}
				} else if (preg_match("/1\x20RELI\x20(.*)/", $lines[$i], $reliA)) {      //# read religion data
					$reli = str_replace("\x27", "\xB4", $reliA[1]);                       //# replace ' with ` because of database relevance
				} else if (preg_match("/1\x20NOTE\x20(.*)/", $lines[$i], $noteA)) {      //# read note
					$note = str_replace("\x27", "\xB4", $noteA[1]);                       //# replace ' with ` because of database relevance
				} else if (preg_match("/2\x20CONC\x20(.*)/", $lines[$i], $concA) || preg_match("/2\x20CONT\x20(.*)/", $lines[$i], $concA)) {      //# extend note
					$note .= $concA[1];
					$note = str_replace("\x27", "\xB4", $note);                           //# replace ' with ` because of database relevance
				} else if (preg_match("/0\x20\x40(F.*)\x40/", $lines[$i], $famindiA)) {  //# a new family entry is found
					if ($anfangf == 1) {                                                   //# if next family entry found, write previous to array
						$famlist = $famindi.";".$husb.";".$wife.";".$marrdate.";".$marrplac;
						$family_list[$famindi]->husb=($husb)?$husb:0;
						$family_list[$famindi]->wife=($wife)?$wife:0;
						$family_list[$famindi]->children=$chil;
						foreach ($chil as $entry) {
							$famlist .= ";".$entry;
						}
						array_push($fam, $famlist);                                         //# fill family entry data in array

						$famlist  = null;
						$marr     = 0;
						$marrdate = null;
						$marrplac = null;
						$famindi  = null;
						$husb     = null;
						$wife     = null;
						$chil     = array();
					}
					if ($anfangf == 0) {                                                   //# if first family entry found, write last person entry to array
						$profile_data[$indi]->l_name=($surn)?$surn:"?";
						$profile_data[$indi]->f_name=($givn?$givn:"?");
						$profile_data[$indi]->sex=($sex)?strtolower($sex):"";
						$profile_data[$indi]->b_date=($birtdate)?$birtdate:"";
						$profile_data[$indi]->d_date=($deatdate)?$deatdate:"";
						array_push($person, $indi.";".$surn.";".$givn.";".$marn.";".$sex.";".$birtdate.";".$birtplac.";".$chrdate.";".$chrplac.";".$deatdate.";".$deatplac.";".$buridate.";".$buriplac.";".$occu2.";".$occudate.";".$occuplac.";".$reli.";".$confdate.";".$confplac.";".$note);
						//# reset all variables of person, start reading family data
						$birt     = 0;
						$deat     = 0;
						$chr      = 0;
						$buri     = 0;
						$occu     = 0;
						$conf     = 0;

						$indi     = null;
						$surn     = null;
						$givn     = null;
						$sex      = null;
						$birtplac = null;
						$birtdate = null;
						$deatplac = null;
						$deatdate = null;
						$chrdate  = null;
						$chrplac  = null;
						$buridate = null;
						$buriplac = null;
						$reli     = null;
						$occu2    = null;
						$occudate = null;
						$occuplac = null;
						$confdate = null;
						$confplac = null;
						$note     = null;
						$anfangf  = 1;
					}
					$famindi = $famindiA[1];
				} else if (preg_match("/1\x20HUSB\x20\x40(.*)\x40/", $lines[$i], $husbA)) { //# husband entry found
					$husb = str_replace("\x27", "\xB4", $husbA[1]);                          //# replace ' with ` because of database relevance
				} else if (preg_match("/1\x20WIFE\x20\x40(.*)\x40/", $lines[$i], $wifeA)) { //# wife entry found
					$wife = str_replace("\x27", "\xB4", $wifeA[1]);                          //# replace ' with ` because of database relevance
				} else if (preg_match("/1\x20CHIL\x20\x40(.*)\x40/", $lines[$i], $cA)) {    //# child entry found
					$c = str_replace("\x27", "\xB4", $cA[1]);                                //# replace ' with ` because of database relevance
					array_push($chil, $c);
					//#################################################################################################################
					//#################################################################################################################
				} else if (preg_match("/1\x20CHAN/", $lines[$i])) {                         //# End of person entry found, reset controling variables
					$deat = 0;
					$chr  = 0;
					$buri = 0;
					$occu = 0;
					$conf = 0;
					$birt = 0;
					$marr = 0;
				} else if (preg_match("/0\x20TRLR/", $lines[$i])) {                         //# End of file reached, save last family entry to array
					$famlist = $famindi.";".$husb.";".$wife.";".$marrdate.";".$marrplac;
					$family_list[$famindi]->husb=($husb)?$husb:0;
					$family_list[$famindi]->wife=($wife)?$wife:0;
					$family_list[$famindi]->children=$chil;
					foreach ($chil as $entry) {
						$famlist .= ";".$entry;
					}
					array_push($fam, $famlist);
				}
		}

		foreach ($family_list as $element) {
			$profile_data[$element->husb]->spouse_id = $element->wife;
			$profile_data[$element->wife]->spouse_id = $element->husb;
			$profile_data[$element->husb]->ch_ids = $element->children;
			$profile_data[$element->wife]->ch_ids = $element->children;
			foreach ($element->children as $el) {
				$profile_data[$el]->f_id=$element->husb;
				$profile_data[$el]->m_id=$element->wife;
			}
		}
		unset($profile_data[0]);
		foreach ($profile_data as $key=>$el) {
			$z=count($profile_data);
			if (!isset($el->sex)||!$el->sex) {
				if ($profile_data[$el->spouse_id]->sex) {
					if ($profile_data[$el->spouse_id]=="m") $el->sex="f";
					if ($profile_data[$el->spouse_id]=="f") $el->sex="m";
				} elseif ($el->ch_ids) {
					foreach ($el->ch_ids as $val) {
						$profile_data[$profile_data[$val]->f_id]->sex="m";
						$profile_data[$profile_data[$val]->m_id]->sex="f";
					}
				}
			}
			if ($el->f_id && !$el->m_id) {
				$profile_data[$key]->m_id=$z;
				$profile_data[$z]->l_name=$profile_data[$key]->l_name;
				$profile_data[$z]->f_name='?';
				$profile_data[$z]->sex='f';
				$profile_data[$z]->b_date='?';
				$profile_data[$z]->d_date='?';
				$profile_data[$z]->f_id=0;
				$profile_data[$z]->m_id=0;
				$profile_data[$z]->ch_ids=$profile_data[$el->f_id]->ch_ids;
				foreach ($profile_data[$el->f_id]->ch_ids as $v) {
					$profile_data[$v]->m_id=$z;
				}
			}
			if (!$el->f_id && $el->m_id) {
				$profile_data[$key]->f_id=$z;
				$profile_data[$z]->l_name=$profile_data[$key]->l_name;
				$profile_data[$z]->f_name='?';
				$profile_data[$z]->sex='m';
				$profile_data[$z]->b_date='?';
				$profile_data[$z]->d_date='?';
				$profile_data[$z]->f_id=0;
				$profile_data[$z]->m_id=0;
				$profile_data[$z]->ch_ids=$profile_data[$el->m_id]->ch_ids;
				foreach ($profile_data[$el->m_id]->ch_ids as $v) {
					$profile_data[$v]->f_id=$z;
				}
			}
		}
		$json = json_encode($profile_data);
		$i=$last_index;
		foreach ($profile_data as $key=>$el) {
			$json = str_replace('"'.$key.'"', "\"".$i."\"", $json);
			$i++;
		}
		unset($profile_data);
		$profile_data = json_decode($json);
		$profile_data=(array)$profile_data;
		return $profile_data;
	}


	function ged_export($array){
		$head="0 HEAD".PHP_EOL."
				1 SOUR SoftServeFT".PHP_EOL."
				2 NAME SoftServeFT".PHP_EOL."
				2 VERS 0.7.2".PHP_EOL."
				2 CORP Soft Serve".PHP_EOL."
				1 _HME @".$array[0]->id."@".PHP_EOL."
				1 DEST ANSTFILE".PHP_EOL."
				1 DATE ".strtoupper(date('d M Y'))."".PHP_EOL."
				2 TIME ".date('H:i:s')."".PHP_EOL."
				1 FILE family_tree.ged".PHP_EOL."
				1 GEDC".PHP_EOL."
				2 VERS 5.5".PHP_EOL."
				2 FORM LINEAGE-LINKED".PHP_EOL."
				1 LANG English".PHP_EOL."
				1 CHAR UTF-8".PHP_EOL."";
		$foot="0 TRLR";
		$family_list="";
		$indi_list="";
		foreach ($array as $key => $value) {
			if($value->spouse_id && $value->sex=="m"){
				$family_list=$family_list.$this->fam($value);
			}
			if(!$value->spouse_id && $value->ch_ids!="[]") {
				$family_list=$family_list.$this->fam($value);
			}
			$indi_list=$indi_list.$this->indi($value);
		}
		$string = $head.$family_list.$indi_list.$foot;
		return $string;
	}

	private function date_conv($string){
		if(!$string || $string=="?"){return "UNKNOWN";}
		$dt=trim($string);//$dob1='dd/mm/yyyy' format
		@list($d, $m, $y) = explode('/', $dt);
		if(!$d || !$m){$d=1; $m=1; $y=$string;}
		@$mk=mktime(0, 0, 0, $m, $d, $y);
		$dt_conv=strtoupper(strftime('%d %h %Y',$mk));
		return $dt_conv;
	}
	

	private function indi($object){
		$string = "0 @I".$object->id."@ INDI".PHP_EOL."
					1 GIVN ".$object->f_name."".PHP_EOL."
					1 SURN ".$object->l_name."".PHP_EOL."
					1 BIRT".PHP_EOL."
					2 DATE ".$this->date_conv($object->b_date).PHP_EOL."
					1 DEAT".PHP_EOL."
					2 DATE ".$this->date_conv($object->d_date).PHP_EOL;
		if($object->f_id){
			$string = $string."1 FAMC @FAM".$object->f_id."@".PHP_EOL;
		}
		if(!$object->f_id && $object->m_id){
			$string = $string."1 FAMC @FAM".$object->m_id."@".PHP_EOL;
		}
		if($object->spouse_id && $object->sex=="m"){
			$string = $string."1 FAMS @FAM".$object->id."@".PHP_EOL;
		}
		if(!$object->spouse_id && $object->ch_ids!="[]"){
			$string = $string."1 FAMS @FAM".$object->id."@".PHP_EOL;
		}
		return $string; 	
	}

	private function fam($object){
		$fam_id = ""; $fam_hu = ""; $fam_wi = ""; $fam_ch = "";
		$fam_id = "0 @FAM".$object->id."@ FAM".PHP_EOL;
		$fam_hu	= ($object->sex=='m') ? "1 HUSB @I".$object->id."@".PHP_EOL : "";
		if($object->sex=='f') { $fam_wi	= "1 WIFE @I".$object->id."@".PHP_EOL; }
		if($object->sex=='m' && $object->spouse_id) { $fam_wi	= "1 WIFE @I".$object->spouse_id."@".PHP_EOL; }
		if($object->ch_ids!="[]"){
			$ch_ids = json_decode($object->ch_ids);
			foreach ($ch_ids as $value) {
				$fam_ch = $fam_ch."1 CHIL @I".$value."@".PHP_EOL;
			}
		}
		$fam = $fam_id.$fam_hu.$fam_wi.$fam_ch;
		return $fam;
	}

	function replaceSpecialChars($statement) {
		// replace umlauts and other special characters. Extend this list, if needed.
		$statement = str_replace("\xC3\xBC", "\xFC", $statement); //ü
		$statement = str_replace("\xC3\xB6", "\xF6", $statement); //ö
		$statement = str_replace("\xC3\x9F", "\xDF", $statement); //ß
		$statement = str_replace("\xC3\xA4", "\xE4", $statement); //ä
		$statement = str_replace("\xC3\xB3", "\xF3", $statement); //ó
		$statement = str_replace("\xC3\xA6", "\xE6", $statement); //æ
		$statement = str_replace("\xC3\xA9", "\xE9", $statement); //é
		$statement = str_replace("\xC3\x96", "\xD6", $statement); //Ö
		return $statement;
	}
}