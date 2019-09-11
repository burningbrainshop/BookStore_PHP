<?php
	$errmsg = isset($_GET["errstr"]) ? $_GET["errstr"] : "Unknow Errors!";
	
	echo "程式或系統發生錯誤：";
	echo "目前應用程式有錯誤發生。這可能是由於網頁操作錯誤或系統運行所產生的錯誤所致。我們已注意到此問題並且盡快派人修復，若造成您的不便，請見諒。";
	echo "錯誤訊息：" . $errmsg;
?>