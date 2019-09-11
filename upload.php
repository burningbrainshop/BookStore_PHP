<?php
	$id = $_GET["id"];
?>
<style>
	body {
		font: 12px Verdana, Arial, sans-serif;
	}
</style>
<form enctype="multipart/form-data" id="upload_form" action="target.php" method="POST" style="background-color:#99CCFF;">
	<input type="hidden" name="prodId" id="prodId" value="<?php echo $id ?>" />
	<input type="file" id="bookPic" name="bookPic" /><br />
	<input type="submit" id="picBtn" value="上傳圖檔" />
</form>
<script type="text/javascript" src="jQuery/js/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="jQuery/js/jquery-ui-1.10.2.custom.min.js"></script>
<link rel="stylesheet" href="jQuery/themes/start/jquery-ui.css" />
<script>
	$("#picBtn").button().click(function(event) {
		$obj = $("#bookPic");
		if($obj.val() == "" || $obj.val() == null)
		{
			alert("欄位空白，請選擇圖檔!");
			return false;
		}
		else
		{
			window.parent.startProgress();
			return true;
		}
	});
</script>
