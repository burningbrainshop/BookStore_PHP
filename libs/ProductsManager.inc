<?php
/*
*-----------------------------------------------------------------------------------------
* ProductsManager.inc
*-----------------------------------------------------------------------------------------
* 建立、修改、刪除與查詢產品基本資料。此物件類別共處理三個功能，包含產品資料設定
* 、產品庫存調整設定、產生呆滯產品名單。
*/

require_once("DBManager.inc");
require_once("CodeManager.inc");

class Products
{
	public $prod_no;
	public $prod_name;
	public $prod_code;
	public $vend_no;
	public $prod_desp;
	public $prod_photoname;
	public $prod_cost;
	public $prod_slprice;
	public $prod_save;
	public $prod_indate;
	public $prod_sldate;
	public $prod_iqty;
	public $prod_nqty;
	public $prod_onsale;
	
	public function __construct($info)
	{
		$this->prod_no = $info["prod_no"];
		$this->prod_name = $info["prod_name"];
		$this->prod_code = $info["prod_code"];
		$this->vend_no = $info["vend_no"];
		$this->prod_desp = $info["prod_desp"];
		$this->prod_photoname = $info["prod_photoname"];
		$this->prod_cost = $info["prod_cost"];
		$this->prod_slprice = $info["prod_slprice"];
		$this->prod_save = $info["prod_save"];
		$this->prod_indate = $info["prod_indate"];
		$this->prod_sldate = $info["prod_sldate"];
		$this->prod_iqty = $info["prod_iqty"];
		$this->prod_nqty = $info["prod_nqty"];
		$this->prod_onsale = $info["prod_onsale"];
	}
}

class ProductsTitleInfo
{
	public $prod_no;
	public $prod_name;
	public $prod_cname;
	public $vend_name;
	public $prod_photoname;
	public $prod_onsale;
	
	public function __construct($info)
	{
		$this->prod_no = $info["prod_no"];
		$this->prod_name = $info["prod_name"];
		$this->prod_cname = $info["prod_cname"];
		$this->vend_name = $info["vend_name"];
		$this->prod_photoname = $info["prod_photoname"];
		$this->prod_onsale = $info["prod_onsale"];
	}
}

class ProductsDetailInfo
{
	public $prod_desp;
	public $prod_cost;
	public $prod_slprice;
	public $prod_save;
	public $prod_indate;
	public $prod_sldate;
	public $prod_iqty;
	public $prod_nqty;
	public $prod_onsale;
	public $prod_astablish;
	
	public function __construct($info)
	{
		$this->prod_desp = $info["prod_desp"];
		$this->prod_cost = $info["prod_cost"];
		$this->prod_slprice = $info["prod_slprice"];
		$this->prod_save = $info["prod_save"];
		$this->prod_indate = $info["prod_indate"];
		$this->prod_sldate = $info["prod_sldate"];
		$this->prod_iqty = $info["prod_iqty"];
		$this->prod_nqty = $info["prod_nqty"];
		$this->prod_onsale = $info["prod_onsale"];
		$this->prod_astablish = $info["prod_astablish"];
	}
}

class TinyProducts
{
	public $prod_no;
	public $prod_name;
	public $prod_save;
	public $prod_iqty;
	public $prod_nqty;
	public $prod_onsale;
	
	public function __construct($info)
	{
		$this->prod_no = $info["prod_no"];
		$this->prod_name = $info["prod_name"];
		$this->prod_save = $info["prod_save"];
		$this->prod_iqty = $info["prod_iqty"];
		$this->prod_nqty = $info["prod_nqty"];
		$this->prod_onsale = $info["prod_onsale"];
	}
}

class ProductsWarnInfo
{
	public $prod_no;
	public $prod_name;
	public $prod_cname;
	public $vend_name;
	public $warning;
	
	public function __construct($info)
	{
		$this->prod_no = $info["prod_no"];
		$this->prod_name = $info["prod_name"];
		$this->prod_cname = $info["prod_cname"];
		$this->vend_name = $info["vend_name"];
		$this->warning = $info["warning"];
	}
}

class ProductsName
{
	public $prod_no;
	public $prod_name;
	
	public function __construct($info)
	{
		$this->prod_no = $info["prod_no"];
		$this->prod_name = $info["prod_name"];
	}
}

class ProductsManager
{
	public function __construct() {}
	function __destruct() {}
	
	public function addProducts($prod_name, $prod_code, $vend_no, $prod_desp, $prod_cost, $prod_slprice, $prod_save)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		$astablish_date = date('Y-m-d');
		
		//-------執行新增SQL指令----------------
		$sql = "INSERT INTO shop_inproduct(prod_name, prod_code, vend_no, prod_desp, prod_cost, prod_slprice, prod_save, prod_iqty, prod_astablish) VALUES('" . $prod_name . "', " . intval($prod_code) . ", " . intval($vend_no) . ", '" . $prod_desp . "', " . intval($prod_cost) .", " . intval($prod_slprice) . ", " . intval($prod_save) . ", 0, '" . $astablish_date . "')";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function delProducts() {}
	
	public function updProducts($prod_no, $prod_name, $prod_code, $vend_no, $prod_desp, $prod_cost, $prod_slprice, $prod_save)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行修改SQL指令----------------
		$sql = "UPDATE shop_inproduct SET prod_name='" . $prod_name . "', prod_code=" . intval($prod_code) . ", vend_no=" . intval($vend_no) . ", prod_desp='" . $prod_desp . "', prod_cost=" . intval($prod_cost) . ", prod_slprice=" . intval($prod_slprice) . ", prod_save=" . intval($prod_save) . " WHERE prod_no=" . intval($prod_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function updPhoto($prod_no, $photoname, $phototype, $photosize)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行修改SQL指令----------------
		$sql = "UPDATE shop_inproduct SET prod_photoname='". $photoname . "', prod_phototype='" . $phototype . "', prod_photosize=" . intval($photosize) . " WHERE prod_no=" . intval($prod_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function updStocks($prod_no, $prod_iqty, $prod_nqty)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($prod_iqty == NULL || $prod_iqty == "")
			$prod_iqty = 0;
			
		if($prod_nqty == NULL || $prod_nqty == "")
			$prod_nqty = 0;
		
		//-------執行修改SQL指令----------------
		$sql = "UPDATE shop_inproduct SET prod_iqty=" . intval($prod_iqty) . ", prod_nqty=" . intval($prod_nqty) . " WHERE prod_no=" . intval($prod_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function updOnsale($prod_no, $onsale)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行修改SQL指令----------------
		$sql = "UPDATE shop_inproduct SET prod_onsale='" . $onsale . "' WHERE prod_no=" . intval($prod_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}

	public function listProducts($sDate, $eDate)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		$sql = "SELECT A.prod_no, A.prod_name, A.prod_photoname, A.prod_onsale, B.prod_name AS prod_cname, C.vend_name FROM shop_inproduct A LEFT JOIN product_set B ON A.prod_code=B.prod_code LEFT JOIN shop_vender C ON A.vend_no=C.vend_no WHERE 1=1";
		
		if($sDate == "" && $eDate == "")
		{		
			$prev3Mon = getdate(strtotime("-90 day"));
			if($prev3Mon["mon"] < 10) { $prev3Mon["mon"] = "0" . $prev3Mon["mon"]; }
			$defaultRange = $prev3Mon["year"] . "-" . $prev3Mon["mon"] .  "-" . $prev3Mon["mday"];
			
			$sql = $sql . " AND (prod_astablish >= '" . $defaultRange . "')";
		}
		
		if($sDate != "")
			$sql = $sql . " AND (prod_astablish >= '" . $sDate . "')";
		
		if($eDate != "")
			$sql = $sql . " AND (prod_astablish <= '" . $eDate . "')";
		
		$sql = $sql . " ORDER BY A.prod_no";

		//-------執行查詢SQL指令----------------		
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) != NULL)
		{
			$output[] = new ProductsTitleInfo($row);
		}
		
		return $output;
	}
	
	public function OneProducts($prod_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM shop_inproduct WHERE prod_no=" . intval($prod_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) != NULL)
		{
			$output[] = new Products($row);
		}
		
		return $output;
	}
	
	public function TinyOneProducts($prod_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT prod_no, prod_name, prod_save, prod_iqty, prod_nqty, prod_onsale FROM shop_inproduct WHERE prod_no=" . intval($prod_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) != NULL)
		{
			$output[] = new TinyProducts($row);
		}
		
		return $output;
	}
	
	public function DetailProducts($prod_no)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//------執行查詢SQL指令-----------------------------------------------
		$sql = "SELECT prod_desp, prod_cost, prod_slprice, prod_save, prod_indate, prod_sldate, prod_iqty, prod_nqty, prod_onsale, prod_astablish FROM shop_inproduct WHERE prod_no=" . intval($prod_no);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = new ProductsDetailInfo($row);
		}
		
		return $output;
	}
	
	public function listWarnProducts($sDate, $eDate)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		$sql = "SELECT A.prod_no, A.prod_name, CASE WHEN A.prod_save > A.prod_nqty THEN 'Y' ELSE 'N' END warning, B.prod_name AS prod_cname, C.vend_name FROM shop_inproduct A LEFT JOIN product_set B ON A.prod_code = B.prod_code LEFT JOIN shop_vender C ON A.vend_no = C.vend_no WHERE 1=1";
		
		if($sDate == "" && $eDate == "")
		{		
			$prev3Mon = getdate(strtotime("-90 day"));
			if($prev3Mon["mon"] < 10) { $prev3Mon["mon"] = "0" . $prev3Mon["mon"]; }
			$defaultRange = $prev3Mon["year"] . "-" . $prev3Mon["mon"] .  "-" . $prev3Mon["mday"];
			
			$sql = $sql . " AND (prod_astablish >= '" . $defaultRange . "')";
		}
		
		if($sDate != "")
			$sql = $sql . " AND (prod_astablish >= '" . $sDate . "')";
		
		if($eDate != "")
			$sql = $sql . " AND (prod_astablish <= '" . $eDate . "')";
		
		$sql = $sql . " ORDER BY A.prod_no";
		
		//------執行查詢SQL指令-----------------------------------------------
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = new ProductsWarnInfo($row);
		}
		
		return $output;
	}
	
	public function listProductName($typeid)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//------執行查詢SQL指令-----------------------------------------------
		$sql = "SELECT prod_no, prod_name FROM shop_inproduct WHERE prod_code=" . intval($typeid) . " ORDER BY prod_no";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = new ProductsName($row);
		}
		
		return $output;
	}
}
?>