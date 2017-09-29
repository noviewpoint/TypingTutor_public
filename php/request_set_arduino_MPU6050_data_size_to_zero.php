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
		// nastavi input_bytes_sensors_data_size na 0!
		try
		{
			$conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$sql = $conn->prepare("UPDATE tt_sensors_data_size SET input_bytes_sensors_data_size = :inputSize WHERE users_fk = (SELECT unique_id FROM users WHERE username = :username) AND tt_sensors_fk = (SELECT id_sensors FROM tt_sensors WHERE name_sensors = :name_sensors)");

			$sql->bindParam(':username', $_SESSION['UserName']);
			$sql->bindValue(':name_sensors', 'arduino_MPU6050');
			$sql->bindValue(':inputSize', 0);
			$sql->execute();

			// ce record s tem kljucem ze obstaja, sql updata


		}
		catch(PDOException $e)
		{
			echo $e->getMessage()."<br />";
		}

		$conn = null;
	}

?>
