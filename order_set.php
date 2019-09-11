<?php

require_once("libs/CodeManager.inc");

if(isset($_GET["type"]))
{
	$osObj = new OrderSet();
	
	$opType = $_GET["type"];
	
	if(isset($_GET["id"]))
		$orderCode = $_GET["id"];
	
	if(isset($_GET["codeName"]))
		$orderName = $_GET["codeName"];
	
	$output = NULL;
	
	switch($opType)
	{
		case "NEW":
			$osObj->addCode($orderName);	
			$output = $osObj->listCode();
			break;
		case "LIST":
			$output = $osObj->listCode();
			break;
		case "SAVE":
			$osObj->modCode($orderCode, $orderName);
			$output = $osObj->listCode();
			break;
		case "DELETE":
			$osObj->delCode($orderCode);
			$output = $osObj->listCode();
			break;
		case "ONE":
			$output = $pvObj->getOneCode($providerCode);
			break;
	}

	$json = array();
	for($i=0; $i<count($output); $i++)
	{
		$json[$i] = array("Id" => $output[$i]["order_code"], "Name" => $output[$i]["order_name"]);
	}

	echo json_encode($json);
}
?>