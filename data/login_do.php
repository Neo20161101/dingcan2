<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/21
 * Time: 15:41
 */

header('Content-Type:application/json');
//header("content-type:text/html;charset:utf-8");
$arr = [];
$output = [];
require('init.php');
session_start();
@$username = $_SESSION['LoginUname'];
 //$row=json_encode($username);
if ($username == null){
    $output['code'] = "-1";
    echo json_encode($output);
}else {
    $sql = "select kf_users.userid from kf_users where uname='$username'";
    $result = mysqli_query($conn,$sql);
    $row = mysqli_fetch_assoc($result);
    echo json_encode($row);
}

