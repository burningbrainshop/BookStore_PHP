<?php

require_once("libs/ProductsManager.inc");

if(isset($_GET["type"]) || isset($_POST["type"]))
{
	$pdObj = new ProductsManager();
	
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
			$pdObj->addProducts($_POST["prod_name"], $_POST["prod_code"], $_POST["vend_no"], $_POST["desp"], $_POST["cprice"], $_POST["sprice"], $_POST["savenum"]);
			$output = $pdObj->listProducts($sDate, $eDate);
			break;
		case "LIST":
			$output = $pdObj->listProducts($sDate, $eDate);
			break;
		case "LISTNAME":
			$output = $pdObj->listProductName($_GET["typeid"]);
			break;
		case "SAVE":
			$pdObj->updProducts($_POST["id"], $_POST["prod_name"], $_POST["prod_code"], $_POST["vend_no"], $_POST["desp"], $_POST["cprice"], $_POST["sprice"], $_POST["savenum"]);
			$output = $pdObj->listProducts($sDate, $eDate);
			break;
		case "DELETE":
			break;
		case "ONE":
			$output = $pdObj->OneProducts($id);
			break;
		case "DETAIL":
			$output = $pdObj->DetailProducts($id);
			break;
		case "UDSALETYPE":
			$pdObj->updOnsale($id, $_GET["onsale"]);
			$output = $pdObj->listProducts($sDate, $eDate);
			break;
		case "WARNLIST":
			$output = $pdObj->listWarnProducts($_GET["sdate"], $_GET["edate"]);
			break;
		case "UDSTOCK":
			$pdObj->updStocks($id, $_GET["iqty"], $_GET["nqty"]);
			$output = $pdObj->TinyOneProducts($id);
			break;
	}
	
	if($opType === "ONE")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("prod_no" => $output[$i]->prod_no, "prod_name" => $output[$i]->prod_name, "prod_code" => $output[$i]->prod_code, "vend_no" => $output[$i]->vend_no, "prod_desp" => $output[$i]->prod_desp, "prod_cost" => $output[$i]->prod_cost, "prod_slprice" => $output[$i]->prod_slprice, "prod_save" => $output[$i]->prod_save, "prod_onsale" => $output[$i]->prod_onsale);
		}

		echo json_encode($json);
	}
	else if($opType === "DETAIL")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("prod_cost" => $output[$i]->prod_cost, "prod_slprice" => $output[$i]->prod_slprice, "prod_save" => $output[$i]->prod_save, "prod_iqty" => $output[$i]->prod_iqty, "prod_nqty" => $output[$i]->prod_nqty, "prod_onsale" => $output[$i]->prod_onsale, "prod_astablish" => $output[$i]->prod_astablish);
		}

		echo json_encode($json);
	}
	else if($opType === "UDSTOCK")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("prod_no" => $output[$i]->prod_no, "prod_name" => $output[$i]->prod_name, "prod_save" => $output[$i]->prod_save, "prod_iqty" => $output[$i]->prod_iqty, "prod_nqty" => $output[$i]->prod_nqty, "prod_onsale" => $output[$i]->prod_onsale);
		}

		echo json_encode($json);
	}
	else if($opType === "WARNLIST")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("prod_no" => $output[$i]->prod_no, "prod_name" => $output[$i]->prod_name, "prod_cname" => $output[$i]->prod_cname, "vend_name" => $output[$i]->vend_name, "warning" => $output[$i]->warning);
		}

		echo json_encode($json);
	}
	else if($opType === "LISTNAME")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("prod_no" => $output[$i]->prod_no, "prod_name" => $output[$i]->prod_name);
		}

		echo json_encode($json);
	}
	else
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("prod_no" => $output[$i]->prod_no, "prod_name" => $output[$i]->prod_name, "prod_cname" => $output[$i]->prod_cname, "vend_name" => $output[$i]->vend_name, "prod_photoname" => $output[$i]->prod_photoname, "prod_onsale" => $output[$i]->prod_onsale);
		}

		echo json_encode($json);
	}
}

?>