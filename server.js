const express = require("express")
const cookieParser = require("cookie-parser");
const app = express()
const PORT = 5000
//app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))

const connectDB = require("./db");

//Connecting the Database
connectDB();

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
)

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})

process.on("uncaughtException", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})

app.use(express.json())
app.use(cookieParser());


const { adminAuth, userAuth } = require("./middleware/auth.js");
app.get("/api/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/api/basic", userAuth, (req, res) => res.send("User Route"));

app.set("view engine", "ejs")

app.get("/", (req, res) => res.render("home"))
app.get("/home", (req, res) => res.render("home"))
app.get("/about", (req, res) => res.render("about"))
app.get("/register", (req, res) => res.render("register"))
app.get("/login", (req, res) => res.render("login"))
app.get("/admin", adminAuth, (req, res) => res.render("admin"))
app.get("/basic", userAuth, (req, res) => res.render("user"))

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.redirect("/")
})

app.use("/api/auth", require("./Auth/route"))

app.use(express.static(__dirname + '/public'));