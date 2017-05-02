<?php
header('Content-Type:application/json');
@$userid = $_REQUEST['userid'];
require('init.php');
$sql = "select kf_users.uname,kf_users.phone from kf_users where userid='$userid'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($result==null){
    echo "{code:-1,msg:error}";
}else{
echo json_encode($row);
}
