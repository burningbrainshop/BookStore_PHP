<?php

require_once("libs/PurchaseManager.inc");

if(isset($_GET["type"]) || isset($_POST["type"]))
{
	$pcObj = new PurchaseManager();
	
	$opType = (isset($_GET["type"])) ? $_GET["type"] : $_POST["type"];
	
	if(isset($_GET["id"]))
		$id = $_GET["id"];
	
	if(isset($_POST["sdate"]) || isset($_GET["sdate"]))
		$sDate = (isset($_POST["sdate"]) ? (($_POST["sdate"] == "") ? "" : $_POST["sdate"]) : (($_GET["sdate"] == "") ? "" : $_GET["sdate"]));
		
	if(isset($_POST["edate"]) || isset($_GET["edate"]))
		$eDate = (isset($_POST["edate"]) ? (($_POST["edate"] == "") ? "" : $_POST["edate"]) : (($_GET["edate"] == "") ? "" : $_GET["edate"]));
	
	
	$output = NULL;
	
	switch($opType)
	{
		case "NEW":
			$pcObj->addPurchase($_POST["vend_no"], $_POST["purch_date"]);
			$output = $pcObj->listPurchaseTitle($sDate, $eDate);
			break;
		case "LIST":
			$output = $pcObj->listPurchaseTitle($sDate, $eDate);
			break;
		case "SAVE":
			$pcObj->updPurchaseTitle($_POST["id"], $_POST["purch_date"]);
			$output = $pcObj->listPurchaseTitle($sDate, $eDate);
			break;
		case "DELETE":
			break;
		case "ONE":
			$output = $pcObj->OnePurchase($id);
			break;
		case "DETAIL":
			$output = $pcObj->listPurchaseDetail($id);
			break;
		case "UPDDETAIL":
			$pcObj->updPurchaseDetail($_POST["val"]);
			$output = $pcObj->listPurchaseDetail($id);
			break;
	}
	
	if($opType === "ONE")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("purch_no" => $output[$i]->purch_no, "vend_name" => $output[$i]->vend_name, "purch_date" => $output[$i]->purch_date, "vend_no" => $output[$i]->vend_no);
		}

		echo json_encode($json);
	}
	else if($opType === "DETAIL" || $opType === "UPDDETAIL")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("purch_detail_no" => $output[$i]->purch_detail_no, "purch_no" => $output[$i]->purch_no, "prod_no" => $output[$i]->prod_no, "prod_name" => $output[$i]->prod_name, "purch_num" => $output[$i]->purch_num, "purch_innum" => $output[$i]->purch_innum, "purch_inprice" => $output[$i]->purch_inprice);
		}

		echo json_encode($json);
	}
	else
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("purch_no" => $output[$i]->purch_no, "vend_name" => $output[$i]->vend_name, "purch_date" => $output[$i]->purch_date, "vend_no" => $output[$i]->vend_no);
		}

		echo json_encode($json);
	}
}

?>