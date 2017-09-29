<?php

	session_start();

	if(!isset($_SESSION['LogedIn']) || $_SESSION['LogedIn'] == "false")
	{
		header("Location: ../login.php");
	}
	else
	{
		echo $_SESSION['UserName'];
	}

?>
