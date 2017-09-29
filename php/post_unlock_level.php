<?php

	session_start();

	if(!isset($_SESSION['LogedIn']) || $_SESSION['LogedIn'] == "false")
	{
		header("Location: ../login.php");
	}
	else
	{
		require_once '../include/config.php';
		$input = json_decode(file_get_contents('php://input'));

		/* PDO + prepared statements */
		try
		{

			$conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			// $conn->exec("set names utf8"); // zakomentirano, ker drugace poizvedbe ne delajo ce username s sumniki

			$sql = $conn->prepare("INSERT INTO tt_users_2_exercises_2_achievements (users_fk, tt_exercises_fk, tt_achievements_fk) VALUES ((SELECT unique_id FROM users WHERE username = :username), (SELECT id_exercises FROM tt_exercises WHERE level_exercises = :level AND sublevel_exercises = :sublevel), :achievement)");

			$sql->bindParam(':username', $_SESSION['UserName']);
			$sql->bindValue(':level', $input->level + 1);
			$sql->bindValue(':sublevel', $input->sublevel + 1);
			$sql->bindValue(':achievement', $input->achievement);
			$sql->execute();

			echo "New record created successfully for old level.\n";

		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}


		// odkleni naslednjo stopnjo, ce je javascript to hotel
		if ($input->unlock)
		{
			/* PDO + prepared statements */
			try
			{
				$conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
				// set the PDO error mode to exception
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				// $conn->exec("set names utf8"); // zakomentirano, ker drugace poizvedbe ne delajo ce username s sumniki

				$sql = $conn->prepare("INSERT INTO tt_users_2_exercises_2_achievements (users_fk, tt_exercises_fk, tt_achievements_fk) VALUES ((SELECT unique_id FROM users WHERE username = :username), (SELECT id_exercises FROM tt_exercises WHERE level_exercises = :level AND sublevel_exercises = :sublevel) + 1, :achievement)");

				$sql->bindParam(':username', $_SESSION['UserName']);
				$sql->bindValue(':level', $input->level + 1);
				$sql->bindValue(':sublevel', $input->sublevel + 1);
				$sql->bindValue(':achievement', 1);
				$sql->execute();

				echo "New record created successfully for new level.\n";

			}
			catch(PDOException $e)
			{
				echo $e->getMessage();
			}
		}

		$conn = null;
	}

?>
