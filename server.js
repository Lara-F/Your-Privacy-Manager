const express= require('express');
const app= express();
const path=require('path');
       
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000; 
/*when the project is deployed the port will probably be an environment variable*/
// Supporting every type of body content type
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*set static folder*/
app.use(express.static(path.join(__dirname,'src')));
app.use(express.static(path.join(__dirname,'build/contracts')));
app.use("/vendor/",express.static(path.join(__dirname,'node_modules/')));
console.log(app);
app.listen(PORT, ()=>console.log('server started on port '+PORT));

