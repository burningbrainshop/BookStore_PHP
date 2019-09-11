<?php

require_once("libs/CodeManager.inc");

if(isset($_GET["type"]))
{
	$pdObj = new ProductSet();
	
	$opType = $_GET["type"];
	
	if(isset($_GET["id"]))
		$productCode = $_GET["id"];
	
	if(isset($_GET["codeName"]))
		$productName = $_GET["codeName"];
	
	$output = NULL;
	
	switch($opType)
	{
		case "NEW":
			$pdObj->addCode($productName);	
			$output = $pdObj->listCode();
			break;
		case "LIST":
			$output = $pdObj->listCode();
			break;
		case "LISTNOTNULL":
			$output = $pdObj->listNotNull();
			break;
		case "SAVE":
			$pdObj->modCode($productCode, $productName);
			$output = $pdObj->listCode();
			break;
		case "DELETE":
			$pdObj->delCode($productCode);
			$output = $pdObj->listCode();
			break;
		case "ONE":
			$output = $pvObj->getOneCode($providerCode);
			break;
	}

	$json = array();
	for($i=0; $i<count($output); $i++)
	{
		$json[$i] = array("Id" => $output[$i]["prod_code"], "Name" => $output[$i]["prod_name"]);
	}

	echo json_encode($json);
}
?>