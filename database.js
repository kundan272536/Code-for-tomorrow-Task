const mysql=require("mysql");
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"code_for_tomorrow"
});
connection.connect((err)=>{
    if(err){
        console.log("Something went wrong",err);
    }
    else{
        console.log("Database connected successfully");
    }
});
module.exports=connection;