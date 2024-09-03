const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

client.setConfig({
    apiKey: "{API_KEY}",
    server: "{SERVER}",
    });

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", async function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    try {
        const response = await client.lists.addListMember("{LIST_ID}", {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        });
        res.sendFile(__dirname + "/success.html");
      } catch (error) {
        res.sendFile(__dirname + "/failure.html");
        console.error(error);
      }
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server is running!!");
});
