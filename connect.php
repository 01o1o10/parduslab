<?php
    $servername = "localhost";
    $username = "root";
    $password = "0o0o0o0o";
    $dbname = "parduslab";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
?>