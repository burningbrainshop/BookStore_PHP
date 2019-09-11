<?php

require_once("../libs/CodeManager.inc");

//if(isset($_GET["type"]) && isset($_GET["name"]))
//{
	$osObj = new OrderSet();
	
	//$opType = $_GET["type"];
	//$codeName = $_GET["name"];
	$opType = "NEW";
	$codeName = iconv("Big5", "UTF-8", "未處理");
	$output = NULL;
	
	if($opType === "NEW")
	{
		$output = $osObj->addCode($codeName);
		
		echo "ID=" . $output[1]["order_code"] . ", Name=" . $output[1]["order_name"];
	}
//}
?>