<?php

if(!isset($_POST['submit']))
{
	$_SESSION['Email']='';
	$_SESSION['Email-error']='';
	$_SESSION['sucess']='';
}
else if(isset($_POST['submit']))
{
	require_once 'include/DB_Connect.php';
	$db1 = new DB_Connect();
	$con=$db1->connect();

	$_SESSION['Email']=mysqli_real_escape_string($con,$_POST['email']);

	/*
	require_once 'include/DB_Functions.php';
	$db = new DB_Functions();
	$forgotpassword=$db->forgotPassword();// not working email !
	*/

	if($forgotpassword)
	{
		$_SESSION['sucess']="New password sent to mail! ";
	}
	else
	{
		$_SESSION['sucess']="Fail! ";
	}
}

?>

<!doctype html>
<html class="no-js" lang="sl">
<!-- https://github.com/h5bp/html5-boilerplate/blob/5.2.0/dist/doc/html.md -->
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title>Login</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="apple-touch-icon" href="apple-touch-icon.png">
	<link type="image/png" rel="icon" href="favikona_portal.png" />
	<!-- Place favicon.ico in the root directory -->

	<!-- Custom styles for this template -->
	<link rel="stylesheet" href="css/vendor/userapp.css" />
	<link rel="stylesheet" href="css/main.css" />
	<link rel="stylesheet" href="css/normalize.css" />

	<script src="js/vendor/modernizr-2.8.3.min.js"></script>
	<!-- BOOTSTRAP iz http://getbootstrap.com/2.3.2/ downloadan na disk -->
	<link href="css/vendor/bootstrap.min.css" rel="stylesheet">
</head>

<body>
	<!--[if lt IE 8]>
	<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
	<![endif]-->

	<!-- Add your site or application content here -->
	<div>

		<form style="font-family: 'Lucida Console', Monaco, monospace;" class="form" method="POST" action="forgot_password.php">
			<h2 class="form-heading">Resetiraj geslo</h2>
			<div class="form-fields">

				<input name="email" style="width: 100%;" placeholder="Email" type="text" class="form-control" value="<?= $_SESSION['Email']; ?>">
				<span style="margin-left: 5px;"><?= $_SESSION['Email-error']; ?></span>

			</div>

			<button style="background-image: none; background-color: #44AB42; border-color: rgb(163, 151, 120); margin-top: 10px; height: 45px; font-size: 18px; line-height: 1.33; border-radius: 6px; padding: 10px 16px;" class="btn btn-lg btn-primary btn-block" type="submit" value="Reset Password" name="submit">
				<span >Resetiraj geslo</span>
			</button>

			<div class="alert-danger"><?= $_SESSION['sucess']; ?></div>
		</form>

		<div style="max-width: 330px; margin: 0 auto;">
			<a style="float: left;" href="login.php">Nazaj na login</a>
		</div>

	</div>

	<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.12.0.min.js"><\/script>')</script>
    <script src="js/plugins.js"></script>

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
    <script>
        /*(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='https://www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        ga('create','UA-XXXXX-X','auto');ga('send','pageview');*/
    </script>

</body>
</html>
