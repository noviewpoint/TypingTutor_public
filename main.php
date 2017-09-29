<?php

session_start();

if(!isset($_SESSION['LogedIn']) || $_SESSION['LogedIn'] == "false")
{
	header("Location: login.php");
}

echo "Uporabnik: ".$_SESSION['UserName'];

?>

<!doctype html>
<html class="no-js" lang="sl">
<!-- https://github.com/h5bp/html5-boilerplate/blob/5.2.0/dist/doc/html.md -->
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title>Spletni portal projekta PKPPZ</title>
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
	<h1>Pozdravljeni na našem portalu!</h1>
	<p>Spodaj imate na izbiro brezplačne testne aplikacije, katere lahko preizkušate in se tudi kaj novega naučite. Veliko veselja Vam želi ekipa PKPPZ.</p>
	<br />
	<ol>
		<li><a href="../typingTutor">Nauči se 10 prstnega tipkanja</a></li>
	</ol>

	<!-- begin wwww.htmlcommentbox.com -->
	<div style="background-color: white; width: 50%; margin: 0 auto; padding: 20px; border-radius: 5px;">
		<!-- begin wwww.htmlcommentbox.com -->
		<div id="HCB_comment_box"><a href="http://www.htmlcommentbox.com">HTML Comment Box</a> is loading comments...</div>
		<link rel="stylesheet" type="text/css" href="//www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0" />
		<script type="text/javascript" id="hcb"> /*<!--*/ if(!window.hcb_user){hcb_user={};} (function(){var s=document.createElement("script"), l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"), h="//www.htmlcommentbox.com";s.setAttribute("type","text/javascript");s.setAttribute("src", h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&opts=16734&num=10&ts=1437757839625");if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})(); /*-->*/ </script>
		<!-- end www.htmlcommentbox.com -->
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
