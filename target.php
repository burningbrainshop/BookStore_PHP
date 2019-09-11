<?php
require_once("libs/ProductsManager.inc");

if(isset($_FILES["bookPic"]["name"]))
{	
	$file_data = "";
	if($_FILES["bookPic"]["name"] != "")
	{
		if($_FILES["bookPic"]["error"] == UPLOAD_ERR_OK)
		{
			$ext = strtolower(pathinfo($_FILES["bookPic"]["name"], PATHINFO_EXTENSION));
			
			switch($ext)
			{
				case "jpg": case "jpeg":
					$file_type = "image/jpeg";
					break;
				case "gif":
					$file_type = "image/gif";
					break;
				case "png":
					$file_type = "image/png";
					break;
				default:
					$file_type = "image/jpeg";
			}

			$file_size = $_FILES["bookPic"]["size"];
			$destFile_dir = "pictures/";
			$destFile_file = $destFile_dir . $_FILES["bookPic"]["name"];
			$ret = @move_uploaded_file($_FILES["bookPic"]["tmp_name"], $destFile_file);
			
			if($ret !== FALSE)
			{
				$pdObj = new ProductsManager();
				$pdObj->updPhoto($_POST["prodId"], $_FILES["bookPic"]["name"], $file_type, $file_size);
				echo <<<DATA
					<body bgcolor="#99CCFF" scroll="no" margin="0">
						<img src="showImg.php?photoName=pictures/{$_FILES["bookPic"]["name"]}" />
					</body>
DATA;
				
			}
			else
				echo "上傳失敗!";
				
		}
		else
			throw new FileUploadExeption($_FILES["bookPic"]["error"]);
	}
	
}
?>