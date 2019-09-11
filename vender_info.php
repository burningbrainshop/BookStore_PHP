<?php

require_once("libs/VenderManager.inc");

if(isset($_GET["type"]) || isset($_POST["type"]))
{
	$vdObj = new VenderManager();
	
	$opType = (isset($_GET["type"])) ? $_GET["type"] : $_POST["type"];
	
	if(isset($_GET["id"]))
		$id = $_GET["id"];
	
	$output = NULL;
	
	switch($opType)
	{
		case "NEW":
			$vdObj->addVender($_POST["company"], $_POST["leader"], $_POST["invoice"], $_POST["contact"], $_POST["phone"], $_POST["fax"], $_POST["provd_code"], $_POST["email"], $_POST["address"], $_POST["edate"], $_POST["discount"]);
			$output = $vdObj->listVender();
			break;
		case "LIST":
			$output = $vdObj->listVender();
			break;
		case "SAVE":
			$vdObj->updVender($_POST["id"], $_POST["company"], $_POST["leader"], $_POST["invoice"], $_POST["contact"], $_POST["phone"], $_POST["fax"], $_POST["provd_code"], $_POST["email"], $_POST["address"], $_POST["edate"], $_POST["discount"]);
			$output = $vdObj->listVender();
			break;
		case "DELETE":
			break;
		case "ONE":
			$output = $vdObj->OneVender($id);
			break;
		case "DETAIL":
			$output = $vdObj->DetailVender($id);
			break;
		case "ALL":
			$output = $vdObj->AllVenders();
			break;
	}
	
	if($opType === "ONE")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("vend_no" => $output[$i]->vend_no, "vend_name" => $output[$i]->vend_name, "vend_invoice" => $output[$i]->vend_invoice, "vend_leader" => $output[$i]->vend_leader, "vend_contact" => $output[$i]->vend_contact, "vend_phone" => $output[$i]->vend_phone, "vend_fax" => $output[$i]->vend_fax, "vend_address" => $output[$i]->vend_address, "vend_email" => $output[$i]->vend_email, "provd_code" => $output[$i]->provd_code, "vend_date" => $output[$i]->vend_date, "vend_discount" => $output[$i]->vend_discount, "vend_astablish" => $output[$i]->vend_astablish);
		}

		echo json_encode($json);
	}
	else if($opType === "DETAIL")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("vend_no" => $output[$i]->vend_no, "vend_name" => $output[$i]->vend_name, "vend_invoice" => $output[$i]->vend_invoice, "vend_leader" => $output[$i]->vend_leader, "vend_contact" => $output[$i]->vend_contact, "vend_phone" => $output[$i]->vend_phone, "vend_fax" => $output[$i]->vend_fax, "vend_address" => $output[$i]->vend_address, "vend_email" => $output[$i]->vend_email, "provd_name" => $output[$i]->provd_name, "vend_date" => $output[$i]->vend_date, "vend_discount" => $output[$i]->vend_discount, "vend_astablish" => $output[$i]->vend_astablish);
		}

		echo json_encode($json);
	}
	else if($opType === "ALL")
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("vend_no" => $output[$i]->vend_no, "vend_name" => $output[$i]->vend_name);
		}

		echo json_encode($json);
	}
	else
	{
		$json = array();
		for($i=0; $i<count($output); $i++)
		{
			$json[$i] = array("vend_no" => $output[$i]->vend_no, "vend_name" => $output[$i]->vend_name, "vend_invoice" => $output[$i]->vend_invoice, "vend_leader" => $output[$i]->vend_leader, "vend_phone" => $output[$i]->vend_phone, "vend_contact" => $output[$i]->vend_contact);
		}

		echo json_encode($json);
	}
}

?>