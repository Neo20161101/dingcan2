<?php
header('Content-Type:application/json');
@$username = $_REQUEST['username'] or die ("[]");
@$pwd = $_REQUEST['pwd'] or die ("[]");
@$phone = $_REQUEST['phone'] or die ("[]");
$arr = [];

//session_start();
//$_SESSION["uname"] = $username;
//访问数据库
require('init.php');
$sql = "insert into kf_users value(null,'$username','$pwd','$phone')";
$result = mysqli_query($conn,$sql);
if($result){
    $arr = mysqli_insert_id($conn);
    echo json_encode($arr);
    session_start();
    $_SESSION['LoginUname'] = $username;
}else{
    echo "{code:-1,msg:注册失败，服务器繁忙，稍等注册！}";
}