<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/6
 * Time: 19:46
 */
header('Content-Type:application/json');
//@$search = $_REQUEST["search"] or die('{"code":-1,"msg":"搜索框不能为空"}');
@$search = $_REQUEST["search"] or die('[]');
//if(empty($search))
//{
//    echo '[]';
//    return;
//}
require('init.php');
$sql = "select * from kf_dish WHERE name LIKE '%$search%' OR  material LIKE '%$search%'";
$result = mysqli_query($conn,$sql);
$output = [];
while(true){
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;

    }else{
        $output[] = $row;
    }

}

echo json_encode($output);


