<!DOCTYPE html>
<html>
  <head>
    <link rel='stylesheet' href='/stylesheets/style.css' />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link rel="stylesheet" href="/stylesheets/style.css">
  </head>
  <body>
    <div class="container">  
     <!-- show any messages that come back with authentication -->
   

      <h1> Register Page</h1>
    <p>lead Say something worthwhile here.</p>
    <br>
    <form role="form" action="/signup" method="POST">
            <div class="form-group">
              <label for="username"><span class="glyphicon glyphicon-user"></span> Username</label>
              <input type="text" class="form-control" name="username" placeholder="Enter username">
            </div>

            <div class="form-group">
              <label for="psw"><span class="glyphicon glyphicon-eye-open"></span> Password</label>
              <input type="text" class="form-control" name='password' id="psw" placeholder="Enter password">
            </div>
            <div class="form-group">
              <label for="email"><span class="glyphicon glyphicon-home"></span> Email</label>
              <input type="text" class="form-control" id="email" name="email" placeholder="Enter email">
            </div>
            <div class="form-group">
              <label for="firstName"><span class="glyphicon glyphicon-user"></span> First Name</label>
              <input type="text" class="form-control" id="firstName" name="firstName" placeholder="Enter firstName">
            </div>
            <div class="form-group">
              <label for="lastName"><span class="glyphicon glyphicon-user"></span> Last Name</label>
              <input type="text" name="lastName" class="form-control" id="lastName" placeholder="Enter lastName">
            </div>
            
            <div class="checkbox">
              <label><input type="checkbox" value="" checked>Remember me</label>
            </div>
            <button type="submit" class="btn btn-default btn-success btn-block"><span class="glyphicon glyphicon-off"></span> Register</button>
          </form>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-default btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>
          <p><% if (message) { %>
     
              <%= message %>
            <% } %> </p>
          <p>Not a member? <a href="#">Sign Up</a></p>
          <p>Forgot <a href="#">Password?</a></p>
        </div>
     
  </body>
  <script src="http://code.jquery.com/jquery.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</html>
