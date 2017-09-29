<?php

    session_start();

    if(!isset($_SESSION['LogedIn']) || $_SESSION['LogedIn'] == "false")
    {
    	header("Location: ../login.php");
    }
    else
    {
    	require_once '../include/config.php';

		echo "userSentDataIterations: " . $_SESSION['userSentDataIterations'] . "\n";
		echo "userSentDataSize: " . $_SESSION['userSentDataSize'] . "\n";

		echo "Session Save Path: " . ini_get('session.save_path') . "\n";

		$session_save_path = ini_get('session.save_path');

		//echo $session_save_path;
		//
		//
		/*$a = $session_save_path . "/sess_pf9o2sp110g7ie0h89agju9lf3";

		$b = file_get_contents($a);
		var_dump($b);
		echo $b;*/

		$krneki = $session_save_path . "/sess_pf9o2sp110g7ie0h89agju9lf3";

		$myfile = fopen($krneki, "r") or die("Unable to open file!");

		$meta = stream_get_meta_data($myfile);
		var_dump($meta['mode']); // r

		$x = stream_get_line($myfile, 100);

		var_dump($myfile);

		echo get_resource_type($myfile);

		$string = stream_get_contents($myfile);






		fclose($myfile);

		echo "To je vsebina" . $x;

		//echo get_resource_type($myfile);

		//var_dump($string);
		//echo $string;

			//$line = stream_get_line($myfile, 10);

			//var_dump($line);

			//echo fread($line, 100);


/*		fclose($myfile);


		$a = $session_save_path . "/krneki";

		$b = file_get_contents($a);
		var_dump($b);
		echo $b;

		echo "shit #1\n";

		$a = $session_save_path . "/sess_pf9o2sp110g7ie0h89agju9lf3";

		$b = file_get_contents($a);
		var_dump($b);
		echo $b;

		echo "shit #2\n";*/

		//print_r(scandir(session_save_path()));

	}

?>
