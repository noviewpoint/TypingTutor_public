<?php

	session_start();

	if(!isset($_SESSION['LogedIn']) || $_SESSION['LogedIn'] == "false")
	{
		header("Location: ../login.php");
	}
	else
	{
		require_once '../include/config.php';
		$input = json_decode(file_get_contents("php://input"));

		try
		{
			$m = new MongoClient(DB_MONGO_ADDRESS);
			$db = $m->typingTutor->exerciseStart;
			$db->insert($input);
			// echo "New record created successfully.\n";
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}

?>
