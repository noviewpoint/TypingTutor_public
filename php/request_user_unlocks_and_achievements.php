<?php

	session_start();

	if(!isset($_SESSION['LogedIn']) || $_SESSION['LogedIn'] == "false")
	{
		header("Location: ../login.php");
	}
	else
	{
		require_once '../include/config.php';

		/* PDO + prepared statements */
		try
		{
			$conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql = $conn->prepare("SELECT tt_exercises.level_exercises, tt_exercises.sublevel_exercises, max(tt_achievements.id_achievements) FROM tt_users_2_exercises_2_achievements JOIN users on tt_users_2_exercises_2_achievements.users_fk = users.unique_id JOIN tt_exercises on tt_users_2_exercises_2_achievements.tt_exercises_fk = tt_exercises.id_exercises JOIN tt_achievements on tt_users_2_exercises_2_achievements.tt_achievements_fk = tt_achievements.id_achievements WHERE users_fk = (SELECT unique_id FROM users WHERE username = :username) GROUP BY users.username, tt_exercises.id_exercises");

			$sql->bindParam(":username", $_SESSION["UserName"]);
			$sql->execute();

			// set the resulting array to associative
			$results = $sql->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($results);
		}
		catch(PDOException $e)
		{
			echo $sql . "<br />" . $e->getMessage();
		}

		$conn = null;
	}

?>
