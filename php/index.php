<?php
session_start();
  include_once("common.inc.php");




    $xml= isset($_REQUEST['xml'])?$_REQUEST['xml']:'';
    $name= isset($_REQUEST['name'])?$_REQUEST['name']:'name';
    if(empty($name)) {
      $name=date('Y-m-d H:i:s');
    }
    $id= isset( $_REQUEST['id'])?$_REQUEST['id']:0;
    $action= isset($_REQUEST['action'])?$_REQUEST['action']:'default';

  $db=new DB('127.0.0.1','root','','mxgraph');

  $xml=mysql_escape_string($xml);
  $name=mysql_escape_string($name);
  $id=mysql_escape_string($id);


  if($action=='checklogin') {

      echo  isset($_SESSION['islogin'])?$_SESSION['islogin']:'0';
      return;
  }


  if( isset($_SESSION['islogin'])&&$_SESSION['islogin']=='1') {
    $userinfo=$_SESSION['user'];
    $uid=$userinfo['id'];
  if($action=='save') {

     $cnt=  $db->scalar("select count(1) cnt from mxgraph where id='$id' and uid='$uid' ");

     if($cnt>0){
         $db->query("update mxgraph set context='$xml',name='$name' where id='$id'");
         out(json_encode(array('id'=>$id,'name'=>stripcslashes($name))));
         return;

     } else {
        $ret= $db->query("insert into mxgraph(context,name,uid) values('$xml','$name','$uid')");
        if($ret) {
         out(json_encode(array('id'=>$db->last_insert_id(),'name'=>stripcslashes($name))));
         return;
        }
     }
  }


  if($action=="listgraph"){

      $graphs= $db->query("select id,name from mxgraph where uid='$uid' order by id desc");

     out( json_encode(array("returnValue"=>$graphs)));
  }

    if($action=="loadgraph"){

      $graphs= $db->query("select id,name,context from mxgraph where id='$id' and uid='$uid' limit 1");

     // out($graphs);

     //print_r($graphs[0]);

     out( json_encode(array("returnValue"=>$graphs[0])));
  }

  }

    if($action=="login"){
         $username= isset($_REQUEST['username'])?$_REQUEST['username']:'username';
        $username= mysql_escape_string($username);
          $pwd= isset($_REQUEST['pwd'])?$_REQUEST['pwd']:'pwd';

      $user= $db->query("select id,username from user where username='$username' and pwd='$pwd'");
      if(!empty($user)){
         $_SESSION['user']=$user[0];
         $_SESSION['islogin']=1;
         echo "1";
         return ;
      } else {
        $_SESSION['user']=null;
        $_SESSION['islogin']=0;
         echo "0";
         return;
      }

  }




















?>
