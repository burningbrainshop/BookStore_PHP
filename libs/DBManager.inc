<?php
/*
*-----------------------------------------------------------------------------------
*DBManager.inc
*-----------------------------------------------------------------------------------
*啟動資料庫連線,並檢驗SQL字串
*/

require_once("dbinfo.inc");
require_once("errors.inc");


class DBManager
{
	private static $s_conn;
		
	public static function getConnect()
	{
		if(DBManager::$s_conn === NULL)
		{
			//判斷連線是否成功,若有錯誤則向例外處理傳遞錯誤訊息
			$conn = @new mysqli(DBHOST, DBUSER, DBPWD, DBNAME);
			
			if(mysqli_connect_errno() !== 0)
			{
				throw new DBConnErrException(mysqli_connect_error());
			}
			DBManager::$s_conn = $conn;
		}
		return DBManager::$s_conn;
		
	}
	
	public function mega_escape($in_str)
	{
		$str = ereg_replace('([\'%;])', '\\\1', $in_str);
		return $str;
	}
}
?>