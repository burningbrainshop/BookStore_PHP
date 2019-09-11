<?php
/*
*-------------------------------------------------------------------------------------
* CodeManager.inc
*-------------------------------------------------------------------------------------
* 建立、修改、刪除與查詢代碼檔資料。此物件類別共處理三個代碼資料表，包含廠
* 商類別代碼設定、產品類別代碼設定、訂單類別代碼設定。
*/

require_once("DBManager.inc");

abstract class CodeManager
{
	/*
	*---------------------------------------------------------------------------------
	* __construct
	*---------------------------------------------------------------------------------
	* We don't need to pass any properties at starting the class.
	*/
	function __construct() {}
	
	/*
	*---------------------------------------------------------------------------------
	* __destruct
	*---------------------------------------------------------------------------------
	* Cleans up this instance.
	*/
	function __destruct() {}
	
	abstract public function addCode($in_name);
	abstract public function delCode($in_code);
	abstract public function modCode($in_code, $in_name);
	abstract public function listCode();
	abstract public function getOneCode($in_code);
	abstract public function listNotNull();
}

class ProviderSet extends CodeManager
{
	public function addCode($in_name)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_name === NULL || $in_name == "")
			throw new IllegalParameterException();
		
		//-------執行新增SQL指令----------------
		$sql = "INSERT INTO provider_set(provd_name) VALUES('" . $in_name . "')";		
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		/*
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM provider_set ORDER BY provd_code";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
	
	public function delCode($in_code)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_code === NULL || $in_code == "")
			throw new IllegalParameterException();
		
		//-------執行新增SQL指令----------------
		$sql = "DELETE FROM provider_set WHERE provd_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		/*
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM provider_set";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
	
	public function modCode($in_code, $in_name)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_code === NULL || $in_code == "")
			throw new IllegalParameterException();
		
		//-------執行修改SQL指令----------------
		$sql = "UPDATE provider_set SET provd_name = '" . $in_name . "' WHERE provd_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function listCode()
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM provider_set ORDER BY provd_code";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
	}
	
	public function getOneCode($in_code)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM provider_set WHERE provd_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
	}
	
	public function listNotNull()
	{
		/*
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT A.prod_code, A.prod_name, B.BookCounts FROM product_set A LEFT JOIN (SELECT prod_code, COUNT(*) AS BookCounts FROM shop_inproduct GROUP BY prod_code) B ON A.prod_code=B.prod_code WHERE B.BookCounts is not null ORDER BY A.prod_code;
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
}

class ProductSet extends CodeManager
{
	public function addCode($in_name)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_name === NULL || $in_name == "")
			throw new IllegalParameterException();
		
		//-------執行新增SQL指令----------------
		$sql = "INSERT INTO product_set(prod_name) VALUES('" . $in_name . "')";		
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		/*
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM product_set ORDER BY prod_code";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
	
	public function delCode($in_code)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_code === NULL || $in_code == "")
			throw new IllegalParameterException();
		
		//-------執行新增SQL指令----------------
		$sql = "DELETE FROM product_set WHERE prod_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		/*
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM product_set ORDER BY prod_code";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
	
	public function modCode($in_code, $in_name)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_code === NULL || $in_code == "")
			throw new IllegalParameterException();
		
		//-------執行修改SQL指令----------------
		$sql = "UPDATE product_set SET prod_name = '" . $in_name . "' WHERE prod_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function listCode()
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM product_set ORDER BY prod_code";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
	}
	
	public function getOneCode($in_code)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM product_set WHERE prod_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
	}
	
	public function listNotNull()
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT A.prod_code, A.prod_name FROM product_set A LEFT JOIN (SELECT prod_code, COUNT(*) AS BookCounts FROM shop_inproduct GROUP BY prod_code) B ON A.prod_code=B.prod_code WHERE B.BookCounts is not null ORDER BY A.prod_code";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
	}
}

class OrderSet extends CodeManager
{
	public function addCode($in_name)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_name === NULL || $in_name == "")
			throw new IllegalParameterException();
		
		//-------執行新增SQL指令----------------
		$sql = "INSERT INTO order_set(order_name) VALUES('" . $in_name . "')";		
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		/*
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM order_set";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
	
	public function delCode($in_code)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_code === NULL || $in_code == "")
			throw new IllegalParameterException();
		
		//-------執行新增SQL指令----------------
		$sql = "DELETE FROM order_set WHERE order_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		/*
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM order_set";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
	
	public function modCode($in_code, $in_name)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		if($in_code === NULL || $in_code == "")
			throw new IllegalParameterException();
		
		//-------執行修改SQL指令----------------
		$sql = "UPDATE order_set SET order_name = '" . $in_name . "' WHERE order_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
	}
	
	public function listCode()
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM order_set ORDER BY order_code";
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
	}
	
	public function getOneCode($in_code)
	{
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT * FROM order_set WHERE order_code = " . intval($in_code);
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
	}
	
	public function listNotNull()
	{
		/*
		$conn = DBManager::getConnect();
		$conn->query("SET NAMES 'utf8'");
		
		//-------執行查詢SQL指令----------------
		$sql = "SELECT A.prod_code, A.prod_name, B.BookCounts FROM product_set A LEFT JOIN (SELECT prod_code, COUNT(*) AS BookCounts FROM shop_inproduct GROUP BY prod_code) B ON A.prod_code=B.prod_code WHERE B.BookCounts is not null ORDER BY A.prod_code;
		$result = @$conn->query($sql);
		if($result === FALSE)
			throw new DatabaseErrException($conn->error);
		
		$output = NULL;
		while(($row = @$result->fetch_assoc()) !== NULL)
		{
			$output[] = $row;
		}
		
		return $output;
		*/
	}
}
?>