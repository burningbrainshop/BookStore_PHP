<?php

require_once("libs/CodeManager.inc");

if(isset($_GET["type"]))
{
	$pvObj = new ProviderSet();
	
	$opType = $_GET["type"];
	
	if(isset($_GET["id"]))
		$providerCode = $_GET["id"];
	
	if(isset($_GET["codeName"]))
		$providerName = $_GET["codeName"];
	
	$output = NULL;
	
	switch($opType)
	{
		case "NEW":
			$pvObj->addCode($providerName);	
			$output = $pvObj->listCode();
			break;
		case "LIST":
			$output = $pvObj->listCode();
			break;
		case "SAVE":
			$pvObj->modCode($providerCode, $providerName);
			$output = $pvObj->listCode();
			break;
		case "DELETE":
			$pvObj->delCode($providerCode);
			$output = $pvObj->listCode();
			break;
		case "ONE":
			$output = $pvObj->getOneCode($providerCode);
			break;			
	}

	$json = array();
	for($i=0; $i<count($output); $i++)
	{
		$json[$i] = array("Id" => $output[$i]["provd_code"], "Name" => $output[$i]["provd_name"]);
	}

	echo json_encode($json);
}
?>