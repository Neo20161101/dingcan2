<?php
header('Content-Type: image/png');

$w = 120;
$h = 30;
$img = imagecreatetruecolor($w, $h);

$c = imagecolorallocate($img, rand(180,240), rand(180,240), rand(180,240));
imagefilledrectangle($img, 0, 0, $w, $h, $c);

$pool = 'ABCDEFGHJKLMNPQRSTWXY13456789';
$vcode = '';
for($i=0; $i<4; $i++){
    $char = $pool[rand(0, strlen($pool)-1)];
    $vcode .= $char;
    $c = imagecolorallocate($img, rand(80,180), rand(80,180), rand(80,180));
    $fs = rand(10, 30);
    $ang = rand(-30, 30);
    $font = 'simhei.ttf';
    $x = $i*30+rand(0,15);
    $y = rand($h, $h-$fs+10);
    imagettftext($img,$fs,$ang, $x, $y, $c, $font, $char);
}
session_start();
$_SESSION['RegisterVcode'] = $vcode;
for($i=0; $i<5; $i++){
  $c = imagecolorallocate($img, rand(0,255), rand(0,255), rand(0,255));
  $x1 = rand(0, $w);
  $y1 = rand(0, $h);
  $x2 = rand(0, $w);
  $y2 = rand(0, $h);
  imageline($img, $x1, $y1, $x2, $y2,$c);
}
for($i=0; $i<50; $i++){
  $c = imagecolorallocate($img, rand(0,255), rand(0,255), rand(0,255));
  $x1 = rand(0, $w);
  $y1 = rand(0, $h);
  imagearc($img, $x1, $y1, 1, 1, 0, 360, $c);
}

imagepng($img);
imagedestroy($img);