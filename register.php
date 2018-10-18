<?php

    include 'connect.php';

    $fname = $_POST["fname"];
    $lname = $_POST["lname"];
    $city = $_POST["city"];
    $uname = $_POST["uname"];
    $pass = $_POST["pass"];

    $sql = "INSERT INTO users(user_name, user_lname, user_city, user_uname, user_pass) VALUES('".$fname."', '".$lname."',".$city.", '".$uname."', '".$pass."')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();

?>