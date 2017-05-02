<?php
/**
 * Created by PhpStorm.
 * User: Hello
 * Date: 2017/4/23
 * Time: 15:48
 */
session_start();
session_destroy();  //销毁$_SESSION数组

echo "success";