<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/6
 * Time: 19:40
 */
//header("content-type:text/html;charset:utf-8");
header('Content-Type:application/json');
$start = $_REQUEST['start'];
$count = 5;
require('init.php');

$sql = "select * from kf_dish LIMIT $start,$count";
$result = mysqli_query($conn,$sql);
$output = [];
while(true){
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;
    }
    $output[] = $row;
}

echo json_encode($output);
//$row = mysqli_fetch_assoc($result);
//if ($row==null){
//    echo "{'code':-2,'msg':'查询不到数据！'}";
//}else{
//    echo "{'code':1,'msg':'查询成功！'}";
//    echo json_encode($row);
//}
