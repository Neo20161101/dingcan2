<?php
header('Content-Type:application/json');

@$user_name = $_REQUEST['user_name'];
@$addr = $_REQUEST['addr'];
@$phone = $_REQUEST['phone'];
@$pwd = $_REQUEST['pwd'];
@$totalprice = 12;
@$cartDetail = $_REQUEST['cartDetail'];


$order_time = time()*1000;

require('init.php');

$sql = "INSERT INTO kf_users VALUES(NULL,'$user_name','$pwd','$phone')";
mysqli_query($conn,$sql);
$userid = mysqli_insert_id($conn);

$sql = "INSERT INTO kf_order values(NULL,'$userid','$phone','$user_name','$order_time','$addr','$totalprice')";
$result = mysqli_query($conn,$sql);


$output = [];
$arr = [];
if($result)
{
$oid = mysqli_insert_id($conn); //获取最近执行的一条INSERT语句生成的自增主键
    //json数据转换为json数组
    $cart = json_decode($cartDetail);
    foreach ($cart as &$one ) {
        //将数据插入到购物车详情
        $sql = "insert into kf_orderdetails values('$oid','$one->did','$one->dishCount','$one->price')";
        $result = mysqli_query($conn, $sql);
        //从购物车中删除
        $sql = "DELETE FROM kf_cart WHERE ctid=$one->ctid";
        $result = mysqli_query($conn,$sql);
    }
    $arr['msg'] = 'succ';
}
else
{
    $arr['msg'] = 'error';
}

$output[] = $arr;

echo json_encode($output);