<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$db_conn = mysqli_connect("localhost", "root", "", "todoapp");
if ($db_conn === false){
    die("ERROR: Could not Connect" . mysqli_connect_error());
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);
    
        if (isset($path[4]) && is_numeric($path[4])){
            $todoid = $path[4];
    
            $getuserrow = mysqli_query($db_conn, "SELECT * FROM tbl_todo WHERE todoid='$todoid'");
            $userrow = mysqli_fetch_assoc($getuserrow);
    
            if ($userrow) {
                echo json_encode($userrow); // Directly output fetched row
                return;
            } else {
                echo json_encode(["error" => "No task records found for this ID."]);
                return;
            }
        } else {
            // Check if search term is provided
            if(isset($_GET['search'])) {
                $searchTerm = mysqli_real_escape_string($db_conn, $_GET['search']);
                $searchQuery = "SELECT * FROM tbl_todo WHERE todotitle LIKE '%$searchTerm%'";
                $alltodo = mysqli_query($db_conn, $searchQuery);
            } else {
                $alltodo = mysqli_query($db_conn, "SELECT * FROM tbl_todo");
            }
    
            if (mysqli_num_rows($alltodo) > 0) {
                $json_array = array();
                while ($row = mysqli_fetch_array($alltodo)) {
                    $json_array[] = array("todoid" => $row['todoid'], "title" => $row['todotitle'], "description" => $row["tododescription"], "time_date" => $row['time_date']);
                }
                echo json_encode($json_array);
                return;
            } else {
                echo json_encode(["result" => "Please check the Data"]);
                return;
            }
        }
        break;

        case "POST":
            $userpostdata = json_decode(file_get_contents("php://input"));
            
            if (isset($userpostdata->title) && isset($userpostdata->description) && isset($userpostdata->time_date)) {
              $todotitle = mysqli_real_escape_string($db_conn, $userpostdata->title);
              $tododescription = mysqli_real_escape_string($db_conn, $userpostdata->description);
              $time_date = mysqli_real_escape_string($db_conn, $userpostdata->time_date);
          
              $result = mysqli_query($db_conn, "INSERT INTO tbl_todo (todotitle, tododescription, time_date)
                VALUES ('$todotitle', '$tododescription', '$time_date')");
          
              if ($result) {
                echo json_encode(["success" => "Todo Added Successfully"]);
              } else {
                echo json_encode(["error" => "Failed to add Todo" . mysqli_error($db_conn)]);
              }
            } else {
              echo json_encode(["error" => "Incomplete data provided"]);
            }
          break;

        case "DELETE":
            $path = explode('/', $_SERVER["REQUEST_URI"]);
            $todoid = $path[4];
            
            if (is_numeric($todoid)) {
                $result = mysqli_query($db_conn, "DELETE FROM tbl_todo WHERE todoid = '$todoid'");
                if ($result) {
                    echo json_encode(["success" => "Todo Deleted Successfully"]);
                    http_response_code(200); // OK
                } else {
                    echo json_encode(["error" => "Failed to delete Todo"]);
                    http_response_code(500); // Internal Server Error
                }
            } else {
                echo json_encode(["error" => "Invalid Todoid"]);
                http_response_code(400); // Bad Request
                
            }
            break;

            case "PUT":
                $putdata = json_decode(file_get_contents("php://input"), true);
                
                $todoid = isset($putdata['todoid']) ? $putdata['todoid'] : null;
                $title = isset($putdata['title']) ? mysqli_real_escape_string($db_conn, $putdata['title']) : '';
                $description = isset($putdata['description']) ? mysqli_real_escape_string($db_conn, $putdata['description']) : '';
                
                if ($todoid !== null) {
                  $updateFields = '';
                  
                  if ($title !== '') {
                    if ($updateFields !== '') {
                      $updateFields .= ', ';
                    }
                    $updateFields .= "todotitle = '$title'";
                  }
                  
                  if ($description !== '') {
                    if ($updateFields !== '') {
                      $updateFields .= ', ';
                    }
                    $updateFields .= "tododescription = '$description'";
                  }
                  
                  $query = "UPDATE tbl_todo SET $updateFields WHERE todoid = '$todoid'";
                  error_log("Update Query: " . $query); // Log the query for debugging
                  
                  $result = mysqli_query($db_conn, $query);
              
                  if ($result) {
                    echo json_encode(["success" => "Task updated successfully"]);
                    http_response_code(200);
                  } else {
                    echo json_encode(["error" => "Failed to update task: " . mysqli_error($db_conn)]);
                    error_log("MySQL Error: " . mysqli_error($db_conn)); // Log MySQL error for debugging
                    http_response_code(500);
                  }
                } else {
                  echo json_encode(["error" => "Invalid task ID"]);
                  http_response_code(400);
                }
                break;
              
            
            
}
?>