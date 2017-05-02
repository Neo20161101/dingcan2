<?php
header("content-type:text/html;charset:utf-8");
@$ctid = $_REQUEST['ctid'] or die('ctid required');
require('init.php');

$sql = "DELETE FROM kf_cart WHERE ctid='$ctid'";
$result = mysqli_query($conn,$sql);
if($result){
    echo json_encode($result);
    echo "{code:1,msg:成功删除！}";
}else{
    echo "{code:-1,msg:删除失败！}";
}
?>