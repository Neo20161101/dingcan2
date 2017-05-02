<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/6
 * Time: 19:48
 */
header('Content-Type:application/json');

@$id = $_REQUEST['id'];

if(empty($id))
{
    echo '[]';
    return;
}

require('init.php');

$sql = "SELECT * FROM kf_dish WHERE did='$id'";
$result = mysqli_query($conn,$sql);

$output = [];
$row = mysqli_fetch_assoc($result);
if(empty($row))
{
    echo '[]';
}
else
{
    $output[] = $row;
    echo json_encode($output);
}