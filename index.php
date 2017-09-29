<?php
// require_once 'include/session_handling.php';
// git session_set_save_handler("sess_open", "sess_close", "sess_read", "sess_write", "sess_destroy", "sess_gc");
session_start();

if(!isset($_SESSION["LogedIn"]) || $_SESSION["LogedIn"] == "false")
{
	header("Location: login.php");
}

require_once "include/first_usage.php";

?>

<!doctype html>
<html class="no-js" lang="sl" ng-app="typingTutor">
<!-- https://github.com/h5bp/html5-boilerplate/blob/5.2.0/dist/doc/html.md -->
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title>Typing Tutor</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="apple-touch-icon" href="apple-touch-icon.png">
	<link type="image/png" rel="icon" href="favikona_typingTutor.png" />
	<!-- Place favicon.ico in the root directory -->

	<link rel="stylesheet" href="css/normalize.css">
	<link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/dodatno.css">
	<!--<link rel="stylesheet" href="css/vendor/bootstrap-slider.min.css">-->
	<link href="css/simple-sidebar.css" rel="stylesheet">

	<script src="js/vendor/modernizr-2.8.3.min.js"></script>
	<link href="css/vendor/animate.css" rel="stylesheet">
	<!-- BOOTSTRAP iz http://getbootstrap.com/2.3.2/ downloadan na disk, nove verzije krneki (zato zakomentirane) -->
	<link href="css/vendor/bootstrap.min.css" rel="stylesheet">
	<!-- <link href="css/vendor/najnovejsi/bootstrap-theme.min.css" rel="stylesheet"> -->
	<!-- <link href="css/vendor/bootstrap-responsive.min.css" rel="stylesheet"> -->
</head>
<!-- nad povrsino aplikacije v FF in Chrome:
- grabanje teksta ni mogoce
- cursor je povsod DEFAULT, razen nad linki pointer
- desni klik onemogocen -->
<body style="cursor: default;" class="neDaSeIzbratiTeksta" oncontextmenu="return false;">
	<!--[if lt IE 8]>
	<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
	<![endif]-->

	<!-- Add your site or application content here -->
	<div id="vsebina" zaznaj-resize ui-view></div>

	<!-- jquery mora biti loadan pred angularjem, da delujejo keypress eventi -->
	<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.12.0.min.js"><\/script>')</script>
    <script src="js/plugins.js"></script>
    <script src="js/main.js"></script>
    <script src="js/vendor/smoothie.js"></script>
    <script src="js/vendor/x2js.min.js"></script>


	<!-- za webcam -->
    <script src="js/vendor/adapter.js"></script>


	<!-- angularjs najnovejsa stable na voljo 1.5 -->
	<script src="js/vendor/angular.min.js"></script>


	<!-- navaden router -->
	<!-- <script src="js/vendor/angular-route.min.js"></script> -->


	<!-- stateful router iz http://angular-ui.github.io/ui-router/release/angular-ui-router.min.js -->
	<script src="js/vendor/angular-ui-router.min.js"></script>

	<!-- animate.css ga rabi za ene Out animacije - dont know why -->
	<script src="js/vendor/angular-animate.min.js"></script>

	<script src="js/vendor/angular-cookies.min.js"></script>
	<script src="js/vendor/angular-translate.min.js"></script>
	<!-- iz https://angular-ui.github.io/bootstrap/ -->
	<script src="js/vendor/ui-bootstrap-tpls-1.1.2.min.js"></script>

	<!-- skripte za porihtan zvok https://github.com/goldfire/howler.js -->
	<script src="js/vendor/howler.min.js"></script>

	<script src="js/app.js"></script>
	<script src="js/services/measurements.service.js"></script>
	<script src="js/services/sharedStates.service.js"></script>
	<script src="js/services/asynchronousCalls.service.js"></script>
	<script src="js/services/audio.service.js"></script>

	<script src="js/services/pravilnoTipkanje.service.js"></script>
	<script src="js/services/computationalModel.service.js"></script>
	<script src="js/services/casovniki.service.js"></script>

	<script src="js/services/imagesAndDivs.service.js"></script>
	<script src="js/services/parsing.service.js"></script>
	<script src="js/services/automaticSwitching.service.js"></script>

	<script src="js/services/canvas.service.js"></script>
	<script src="js/services/smejko.service.js"></script>
	<script src="js/services/flags.service.js"></script>
	<script src="js/services/okvir.service.js"></script>
	<script src="js/services/movingLetters.service.js"></script>

	<script src="js/controllers/menu.controller.js"></script>
	<script src="js/controllers/menu.modal.controller.js"></script>

	<script src="js/controllers/profile.controller.js"></script>

	<script src="js/controllers/exercise.controller.js"></script>
	<script src="js/controllers/exercise.modal.controller.js"></script>
	<script src="js/controllers/exercise.modal.questions.controller.js"></script>
	<script src="js/controllers/graf.controller.js"></script>
	<script src="js/controllers/navodila.controller.js"></script>
	<script src="js/controllers/debug.controller.js"></script>
	<script src="js/controllers/pretipkavanje.controller.js"></script>

	<script src="js/controllers/statistics.controller.js"></script>

	<script src="js/directives/nivo.directive.js"></script>
	<script src="js/directives/stopnja.directive.js"></script>
	<script src="js/directives/graf.directive.js"></script>
	<script src="js/directives/colorBars.directive.js"></script>
	<script src="js/directives/hoverMakesFontRed.directive.js"></script>
	<script src="js/directives/akcijaObResize.directive.js"></script>
	<script src="js/directives/zaznajResize.directive.js"></script>
	<script src="js/directives/motnja.directive.js"></script>

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
