login
<!DOCTYPE html>
<html>
<head>
  <title>Login</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h2>Login</h2>
  <input id="emailInput" placeholder="Email">
  <input id="passwordInput" type="password" placeholder="Password">
  <button onclick="login()">Login</button>

  <script type="module" src="js/auth.js"></script>
</body>
</html>

css

body {
  font-family: Arial, sans-serif;
  margin: 0;
  background: #f5f5f5;
}

header {
  background: #2e7d32;
  color: white;
  padding: 15px;
}

header h1 {
  margin: 0;
}

nav a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
  font-weight: bold;
}

.search {
  padding: 15px;
  text-align: center;
}

.search input {
  width: 60%;
  padding: 10px;
  font-size: 16px;
}

.campaign-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  padding: 20px;
}

.campaign {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.campaign h3 {
  margin-top: 0;
}

.progress {
  background: #ddd;
  border-radius: 20px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-bar {
  height: 12px;
  background: #2e7d32;
}

button {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background: #1b5e20;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
