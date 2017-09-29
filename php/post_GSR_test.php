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
		$input_serialized_to_string = (string) serialize($input);

		// strlen() returns the number of bytes in a string.
		$input_size_in_bytes = strlen($input_serialized_to_string);
		//echo "Vsebina stringa:" . $input_serialized_to_string . "\n";
		echo "Velikost stringa:" . $input_size_in_bytes . "\n";

		try
		{
			$m = new MongoClient(DB_MONGO_ADDRESS);
			$db = $m->typingTutor->multilux_GSR_test;
			foreach ($input as $value)
			{
				$db->insert($value);
				// echo "New record created successfully.\n";
			}
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}

		try
		{
			$conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$sql = $conn->prepare("UPDATE tt_sensors_data_size SET input_bytes_sensors_data_size = :inputSize WHERE users_fk = (SELECT unique_id FROM users WHERE username = :username) AND tt_sensors_fk = (SELECT id_sensors FROM tt_sensors WHERE name_sensors = :name_sensors)");

			$sql->bindParam(':username', $_SESSION['UserName']);
			$sql->bindValue(':name_sensors', 'multilux_GSR');
			$sql->bindValue(':inputSize', $input_size_in_bytes);
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
