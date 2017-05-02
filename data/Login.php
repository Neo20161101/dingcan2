<?php
header('Content-Type:application/json');
@$username = $_REQUEST['username'] or die ("[]");
@$pwd = $_REQUEST['pwd'] or die ("[]");

require('init.php');

$sql = "select kf_users.userid,kf_users.uname,kf_users.pwd from kf_users where uname='$username' AND pwd='$pwd'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row==null){
    //echo "{code:-1,msg:登陆失败或无账号}";
    echo json_encode($row);
}else{
    echo json_encode($row);
    session_start();
    $_SESSION['LoginUname'] = $username;
}

?>