<?php

    include 'connect.php';

    $uname = $_POST["uname"];
    $pass = $_POST["pass"];

    $sql = "SELECT * FROM users WHERE user_uname='".$uname."' and user_pass='".$pass."'";
    $result = $conn->query($sql);

    //$row = $result->fetch_assoc();

    if($result->num_rows == 1){
        header("Location:portal.html");
    }
    else{
        echo "Incorrect username or password!";
    }
    $conn->close();

?>