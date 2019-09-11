<?php
/*
*-----------------------------------------------------------------------------------
*errors.inc
*-----------------------------------------------------------------------------------
*設定錯誤處理程序,例外處理程序,以及異常的例外處理類別
*/

define("LOG_PATH", "errlog/errlog.log");
DATE_DEFAULT_TIMEZONE_SET("Asia/Taipei");

//---------設定錯誤處理程序--------------------------------------------------------
function app_error_handler($err_no, $err_msg, $err_file, $err_line, $err_contxt)
{
	//寫入日誌檔
	error_log(date("c") . " 系統發生錯誤：(" . $err_no . ") " . $err_msg . "-" . $err_file . "[" . $err_line . "]\r\n", 3, LOG_PATH);

	//引導致錯誤處理網頁
	header("location:errors.php?errstr=" . $err_msg);
}

//---------設定例外處理程序--------------------------------------------------------
function app_exception_handler($e)
{
	$err_msg = $e->getMessage();
	$err_file = $e->getFile();
	$err_line = $e->getLine();
	
	//寫入日誌檔
	error_log(date("c") . " 異常例外發生：" . $err_msg . "-" . $err_file . "[" . $err_line . "]\r\n", 3, LOG_PATH);
	
	//引導致錯誤處理網頁
}

set_error_handler('app_error_handler');
set_exception_handler('app_exception_handler');

/*
*------------------------------------------------------------------------------------
* Create new Exception
*------------------------------------------------------------------------------------
* 建立新的異常類別
*/

class DBConnErrException extends Exception
{
	function __construct($msg)
	{
		parent::__construct("An error occured while connection the Database.(" . $msg . ")");
	}
}

class DatabaseErrException extends Exception
{
	function __construct($msg)
	{
		parent::__construct("An error occured while SQL executed!(" . $msg . ")");
	}
}

class SessionCmpException extends Exception
{
	function __construct()
	{
		parent::__construct("There is a security problem occured while checking the Session. Please login again.");
	}
}

class NoSessionException extends Exception
{
	function __construct()
	{
		parent::__construct("There is a security problem occured while checking the Session. The Session is expired.");
	}
}

class IllegalParameterException extends Exception
{
	function __construct()
	{
		parent::__construct("The system got the illegal parameter while creating orders.");
	}
}

class FileUploadException extends Exception
{
	function __construct($msg)
	{
		parent::__construct("Error occured while uploading files!(" . $msg . ")");
	}
}

class OpenFileErrorException extends Exception
{
	function __construct()
	{
		parent::__construct("Can't not get the content of the uploading files.");
	}
}
?>