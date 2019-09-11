<?php
/*
*-------------------------------------------------------------------------------------
* VenderManager.inc
*-------------------------------------------------------------------------------------
* 建立、修改、刪除與查詢廠商基本資料。
*
*/

require_once("DBManager.inc");

class VenderInfo
{
	public $vend_no;
	public $vend_name;
	public $vend_leader;
	public $vend_invoice;
	public $vend_contact;
	public $vend_phone;
	public $vend_fax;
	public $provd_code;
	public $vend_email;
	public $vend_address;
	public $vend_date;
	public $vend_discount;
	public $vend_astablish;
	
	public function __construct($info)
	{
		$this->vend_no = $info["vend_no"];
		$this->vend_name = $info["vend_name"];
		$this->vend_leader = $info["vend_leader"];
		$this->vend_invoice = $info["vend_invoice"];
		$this->vend_contact = $info["vend_contact"];
		$this->vend_phone = $info["vend_phone"];
		$this->vend_fax = $info["vend_fax"];
		$this->provd_code = $info["provd_code"];
		$this->vend_email = $info["vend_email"];
		$this->vend_address = $info["vend_address"];
		$this->vend_date = $info["vend_date"];
		$this->vend_discount = $info["vend_discount"];
		$this->vend_astablish = $info["vend_astablish"];
	}
}

class VenderTitle
{
	public $vend_no;
	public $vend_name;
	
	public function __construct($info)
	{
		$this->vend_no = $info["vend_no"];
		$this->vend_name = $info["vend_name"];
	}
}

class VenderTitleInfo
{
	public $vend_no;
	public $vend_name;
	public $vend_leader;
	public $vend_invoice;
	public $vend_contact;
	public $vend_phone;
	public $vend_discount;
	
	public function __construct($info)
	{
		$this->vend_no = $info["vend_no"];
		$this->vend_name = $info["vend_name"];
		$this->vend_leader = $info["vend_leader"];
		$this->vend_invoice = $info["vend_invoice"];
		$this->vend_contact = $info["vend_contact"];
		$this->vend_phone = $info["vend_phone"];
	}
}

class VenderDetailInfo
{
	public $vend_no;
	public $vend_name;
	public $vend_leader;
	public $vend_invoice;
	public $vend_contact;
	public $vend_phone;
	public $vend_fax;
	public $provd_code;
	public $provd_name;
	public $vend_email;
	public $vend_address;
	public $vend_date;
	public $vend_discount;
	public $vend_astablish;
	
	public function __construct($info)
	{
		$this->vend_no = $info["vend_no"];
		$this->vend_name = $info["vend_name"];
		$this->vend_leader = $info["vend_leader"];
		$this->vend_invoice = $info["vend_invoice"];
		$this->vend_contact = $info["vend_contact"];
		$this->vend_phone = $info["vend_phone"];
		$this->vend_fax = $info["vend_fax"];
		$this->provd_code = $info["provd_code"];
		$this->provd_name = $info["provd_name"];
		$this->vend_email = $info["vend_email"];
		$this->vend_address = $info["vend_address"];
		$this->vend_date = $info["vend_date"];
		$this->vend_discount = $info["vend_discount"];
		$this->vend_astablish = $info["vend_astablish"];
	}
}

class VenderManager
{
	public function __construct() {}
	
	public function __destruct() {}
	
	public function addVender($company, $leader, $invoice, $contact, $phone, $fax, $provd_code, $email, $address, $vend_date, $discount)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		$astablish_date = date('Y-m-d');
		
		//------執行新增SQL指令-----------------------------------------------
		$sql = "INSERT INTO shop_vender(vend_name, vend_leader, vend_invoice, vend_contact, vend_phone, vend_fax, provd_code, vend_email, vend_address, vend_date, vend_discount, vend_astablish) VALUES ('" . $company . "', '" . $leader . "', '" . $invoice . "', '" . $contact . "', '" . $phone . "', '" . $fax . "', " . intval($provd_code) . ", '" . $email . "', '" . $address . "', '" . $vend_date . "', " . intval($discount) . ", '" . $astablish_date . "')";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function updVender($vend_no, $company, $leader, $invoice, $contact, $phone, $fax, $provd_code, $email, $address, $vend_date, $discount)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//------執行修改SQL指令-----------------------------------------------
		$sql = "UPDATE shop_vender SET vend_name='" . $company . "', vend_leader='" . $leader . "', vend_invoice='" . $invoice . "', vend_contact='" . $contact . "', vend_phone='" . $phone . "', vend_fax='" . $fax . "', provd_code=" . intval($provd_code) . ", vend_email='" . $email . "', vend_address='" . $address . "', vend_date='" . $vend_date . "', vend_discount=" . intval($discount) . " WHERE vend_no=" . intval($vend_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function delVender() {}
	
	public function listVender()
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//------執行查詢SQL指令-----------------------------------------------
		$sql = "SELECT vend_no, vend_name, vend_leader, vend_invoice, vend_phone, vend_contact FROM shop_vender ORDER BY vend_no";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = new VenderTitleInfo($row);
		}
		
		return $output;
	}
	
	public function OneVender($vend_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//------執行查詢SQL指令-----------------------------------------------
		$sql = "SELECT * FROM shop_vender WHERE vend_no=" . intval($vend_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = new VenderInfo($row);
		}
		
		return $output;
	}
	
	public function AllVenders()
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//------執行查詢SQL指令-----------------------------------------------
		$sql = "SELECT vend_no, vend_name FROM shop_vender ORDER BY vend_no";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = new VenderTitle($row);
		}
		
		return $output;
	}
	
	public function DetailVender($vend_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//------執行查詢SQL指令-----------------------------------------------
		$sql = "SELECT A.*, B.provd_name AS provd_name FROM shop_vender A LEFT JOIN provider_set B ON A.provd_code=B.provd_code WHERE A.vend_no=" . intval($vend_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = new VenderDetailInfo($row);
		}
		
		return $output;
	}
}
?>