<?php
require_once("libs/DBManager.inc");

if(isset($_GET["photoName"]))
{
	$src = imagecreatefromjpeg($_GET["photoName"]);
	$src_w = imagesx($src);
	$src_h = imagesy($src);
	
	$max_thumb_size = 100;
	if($src_w > $src_h)
	{
		$thumb_w = $max_thumb_size;
		$thumb_h = intval($src_h / $src_w * $thumb_w);
	}
	else
	{
		$thumb_h = $max_thumb_size;
		$thumb_w = intval($src_w / $src_h * $thumb_h);
	}
	
	$thumb = imagecreatetruecolor($thumb_w, $thumb_h);
	
	imagecopyresized($thumb, $src, 0, 0, 0, 0, $thumb_w, $thumb_h, $src_w, $src_h);
	
	header("Content-type:image/jpeg");
	imagejpeg($thumb, null, 100);
	
	imagedestroy($src);
	imagedestroy($thumb);
}
?>