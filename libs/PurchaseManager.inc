<?php
/*
*------------------------------------------------------------------------------------
* PurchaseManager.inc
*------------------------------------------------------------------------------------
* 建立、修改、刪除與查詢採購單資料。此物件類別共處理三個功能，包含建立採購
* 單資料、採購產品資料設定、產生已訂未交名單。
*/

require_once("DBManager.inc");

class PurchaseTitle
{
	public $purch_no;
	public $vend_no;
	public $vend_name;
	public $purch_date;
	
	public function __construct($info)
	{
		$this->purch_no = $info["purch_no"];
		$this->vend_no = $info["vend_no"];
		$this->vend_name = $info["vend_name"];
		$this->purch_date = $info["purch_date"];
	}
}

class PurchaseDetail
{
	public $purch_detail_no;
	public $prod_no;
	public $prod_name;
	public $purch_num;
	public $purch_innum;
	public $purch_inprice;
	
	public function __construct($info)
	{
		$this->purch_no = $info["purch_detail_no"];
		$this->prod_no = $info["prod_no"];
		$this->prod_name = $info["prod_name"];
		$this->purch_num = $info["purch_num"];
		$this->purch_innum = $info["purch_innum"];
		$this->purch_inprice = $info["purch_inprice"];
	}
}

class PurchaseManager
{
	function __construct() {}
	function __destruct() {}
	
	public function addPurchase($vend_no, $purch_date)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		$astablish_date = date('Y-m-d');
		
		//-----執行新增SQL指令-------------------------
		$sql = "INSERT INTO shop_purchtitle (vend_no, purch_date, purch_astablish) VALUES (" . intval($vend_no) . ", '" . $purch_date . "', '" . $astablish_date . "')";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function addPurchDetail($purch_no, $prod_no, $purch_num)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行新增SQL指令-------------------------
		$sql = "INSERT INTO shop_purchase (purch_no, prod_no, purch_num) VALUES (" . intval($purch_no) . ", " . intval($prod_no) . ", " . intval($purch_num) . ")";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function delPurchase($purch_no)
	{
		if($purch_no == NULL) { throw new IllegalParameterException(); }
		
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行刪除SQL指令-------------------------
		$conn->autocommit(FALSE);
		
		try
		{
			$this->delPurchaseTitle($purch_no);
			$this->delAllPurchaseDetails($purch_no);
		}
		catch(Exception $e)
		{
			$conn->rollback();
			$conn->autocommit(TRUE);
			throw $e;
		}
		
		$conn->commit();
		$conn->autocommit(TRUE);
		$conn->close();
	}
	
	public function delPurchaseTitle($purch_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行刪除SQL指令-------------------------
		$sql = "DELETE FROM shop_purchtitle WHERE purch_no=" . intval($purch_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function delAllPurchaseDetails($purch_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行刪除SQL指令-------------------------
		$sql = "DELETE FROM shop_purchase WHERE purch_no=" . intval($purch_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function delPurchaseDetail($purch_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行刪除SQL指令-------------------------
		$sql = "DELETE FROM shop_purchase WHERE purch_no=" . intval($purch_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function updPurchaseTitle($purch_no, $purch_date)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行修改SQL指令-------------------------
		$sql = "UPDATE shop_purchtitle SET purch_date='" . $purch_date . "' WHERE purch_no=" . intval($purch_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function updPurchaseDetail($purch_details)
	{
		$Items = json_decode($purch_details);
		
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行刪除SQL指令-------------------------
		$conn->autocommit(FALSE);
		
		try
		{
			$this->delPurchaseDetail($Items[0]->purch_no);
			
			for($i=0; $i < count($Items); $i++)
			{
				$this->updDetails($Items[$i]->purch_no, $Items[$i]->prod_no, $Items[$i]->purch_num);
			}
		}
		catch(Exception $e)
		{
			$conn->rollback();
			$conn->autocommit(TRUE);
			throw $e;
		}
		
		$conn->commit();
		$conn->autocommit(TRUE);
		//$conn->close();
	}
	
	public function updDetails($purch_no, $prod_no, $purch_num)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-----執行修改SQL指令-------------------------
		$sql = "INSERT INTO shop_purchase (purch_no, prod_no, purch_num) VALUES (" . intval($purch_no) . ", " . intval($prod_no) . ", " . intval($purch_num) . ")";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function listPurchaseTitle($sDate, $eDate)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		$sql = "SELECT A.*, B.vend_name FROM shop_purchtitle A LEFT JOIN shop_vender B ON A.vend_no=B.vend_no WHERE 1=1";
		
		if($sDate == "" && $eDate == "")
		{		
			$prev3Mon = getdate(strtotime("-90 day"));
			if($prev3Mon["mon"] < 10) { $prev3Mon["mon"] = "0" . $prev3Mon["mon"]; }
			$defaultRange = $prev3Mon["year"] . "-" . $prev3Mon["mon"] .  "-" . $prev3Mon["mday"];
			
			$sql = $sql . " AND (purch_astablish >= '" . $defaultRange . "')";
		}
		
		if($sDate != "")
			$sql = $sql . " AND (purch_astablish >= '" . $sDate . "')";
		
		if($eDate != "")
			$sql = $sql . " AND (purch_astablish <= '" . $eDate . "')";
		
		$sql = $sql . " ORDER BY A.purch_no";

		//-------執行查詢SQL指令----------------		
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) != NULL)
		{
			$output[] = new PurchaseTitle($row);
		}
		
		return $output;
	}
	
	public function listPurchaseDetail($purch_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------	
		$sql = "SELECT A.prod_no, A.purch_num, A.purch_innum, A.purch_inprice, B.prod_name FROM shop_purchase A LEFT JOIN shop_inproduct B ON A.prod_no=B.prod_no WHERE purch_no=" .intval($purch_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) != NULL)
		{
			$output[] = new PurchaseDetail($row);
		}
		
		return $output;
	}
	
	public function OnePurchase($purch_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------	
		$sql = "SELECT A.*, B.vend_name FROM shop_purchtitle A LEFT JOIN shop_vender B ON A.vend_no=B.vend_no WHERE purch_no=" .intval($purch_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) != NULL)
		{
			$output[] = new PurchaseTitle($row);
		}
		
		return $output;
	}
}
?>