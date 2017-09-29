<?php

	session_start();

	if(!isset($_SESSION['LogedIn']) || $_SESSION['LogedIn'] == "false")
	{
		header("Location: ../login.php");
	}
	else
	{
		require_once '../include/config.php';

		try
		{
			$m = new MongoClient(DB_MONGO_ADDRESS);
			$db = $m->typingTutor->questions;
			$kk = $db->find();

			// nekaksen vgrajeni foreach, brez zajebavanja
			echo json_encode(iterator_to_array($kk));
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}

?>
