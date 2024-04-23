const connection = require("./database");
const bodyParser = require('body-parser');
const express = require("express");
const verifyToken=require("./auth");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const http = require("http");
const port = 3000;
const jwt = require('jsonwebtoken');
const secretKey = "secretkey";
const validator=require('node-input-validator');

app.get("/", (req, res) => {
  res.send("Routing done");
});


/*Login API */
app.post('/login', (req, res) => {
  const email = req?.body?.email ?? " ";
  const password = req?.body?.password ?? " ";
  const sql2=`SELECT email FROM userdetails WHERE email='${email}'`;
  connection.query(sql2,function(err,rows){
    if(err){
      res.status(400).send({status:400,message:err.sqlMessage,data:{}});
    }
    else if(rows[0]){
    const sql3=`SELECT email FROM userdetails WHERE email='${email}' AND password='${password}'`;
    connection.query(sql3,function(err,rows){
      if(err){
        res.status(400).send({status:400,message:err.sqlMessage,data:err});
      }
      else if(rows[0]){
        jwt.sign({rows},secretKey,{expiresIn:'2 days'},(err,token)=>{
          if(err){
            res.status(400).send({status:400,message:"Something went wrong",data:err});
          }
          else{
            res.status(200).send({status:200,message:"Login successfully",data:{},token:token});
          }
        })
      }
      else{
        res.status(400).send({status:400,message:"Password is incorrect",data:{}});
      }
    });
    }
    else{
      res.status(404).send({status:404,message:"Email does not exist",data:{}});
    }
  })
});


// Category Functionality all below //
//Add Category name API
app.post("/category",verifyToken,(req,res)=>{
  const category_name=req?.body?.category_name ?? " ";
  console.log("Ctegory name",category_name);
  const sql1=`INSERT INTO category (category_name) values ('${category_name}')`;
  connection.query(sql1,function(err,result){
    if(err){
      res.status(400).send({status:400,message:err.sqlMessage,data:{}});
    }
    else{
      res.status(200).send({status:200,message:"Category added successfully",data:{}});
    }
  })
});

/*Listing API */
app.get("/categories",verifyToken, (req, res) => {
  const sql = `SELECT * FROM category`;
  connection.query(sql, (err, rows) => {
    if (err) {
      res.status(400).send({ status: 400, message: "Data not found", data: {} });
    }
    else {
      res.status(200).send({ status: 200, message: "List of Data", data: rows });
    }
  });
});

/* Update API For Category_id */
app.put("/category/:categoryId",verifyToken,(req,res)=>{
  const categoryId=req.params.categoryId;
  const category_name=req?.body?.category_name?? " ";
  const sql=`SELECT * FROM category WHERE categoryId='${categoryId}'`;
  connection.query(sql,(err,result)=>{
    if(err){
      res.status(400).send({ status: 400, message: "Something went Wrong", data:{err} });
    }
    else{
      if(result[0]){
        const sql1=`UPDATE category SET category_name='${category_name}' WHERE categoryId='${categoryId}' `;
        connection.query(sql1,(err,rows)=>{
          if(err){
            res.status(400).send({status: 400, message: "Something went Wrong", data:{err}})
          }
          else{
            res.status(200).send({ status: 200, message: "Data Updated Successfully", data: rows });

          }
        });
      }
    }
  });
});

/*remove Empty Service API */
app.delete("/category/:categoryId",verifyToken,(req,res)=>{
  const categoryId=req.params.categoryId;
  const sql1=`SELECT * FROM category WHERE categoryId='${categoryId}'`;
  connection.query(sql1,(err,result)=>{
    if(err){
      res.status(400).send({status:400,message:"Something went wrong",data:{err}})
    }
    else if(result[0]){
      const sql=`DELETE FROM category WHERE categoryId='${categoryId} '`;
      connection.query(sql,(err,rows)=>{
        if(err){
          res.status(400).send({status:400,message:"Something went wrong",data:{err}});

        }
        else{
          res.status(200).send({status:200,message:"Data deleted successfully",data:{}});
        }
      })
    }
    else{
      res.status(404).send({status:404,message:"Data not found",data:{result}});
    }
  })
})







/*Services API */

/* Create an API to add services as per the Service Schema. */
app.post("/category/:categoryId/service",verifyToken,(req,res)=>{
  const categoryId=req?.params?.categoryId ?? " ";
  const service_name=req?.body?.service_name ?? " ";
  const type=req?.body?. type ?? " ";
  const price= req?.body?. price?? " ";
  const sql=`INSERT INTO service (categoryId,service_name,type,price) VALUES('${categoryId}','${service_name}','${type}','${price}')`;
  connection.query(sql,(err,rows)=>{
if(err){
  res.status(400).send({status: 400, message: "Something went Wrong", data:{err}})
}
else{
  res.status(200).send({ status: 200, message: "Data Inserted Successfully", data: rows });

}
  });
});

 /*Create an API to get a list of all services inside any category. */
 app.get("/category/:categoryId/services",verifyToken, (req, res) => {
  const sql = `SELECT * FROM service`;
  connection.query(sql, (err, rows) => {
    if (err) {
      res.status(400).send({ status: 400, message: "Data not found", data: {} });
    }
    else {
      res.status(200).send({ status: 200, message: "List of Data", data: rows });
    }
  });
});

/*Create an API to remove service from category. */
app.delete("/category/:categoryId/service/:serviceId",verifyToken,(req,res)=>{
  const serviceId=req.params.serviceId;
  const sql=`SELECT * FROM service WHERE serviceId='${serviceId}'`;
  connection.query(sql,(err,rows)=>{
    if(err){
      res.status(400).send({ status: 400, message: "Something Went wrong", data: {err} });
    }
    else if(rows[0]){
      const sql1=`DELETE FROM service WHERE serviceId='${serviceId}'`;
      connection.query(sql1,(err,rows)=>{
        if(err){
          res.status(400).send({ status: 400, message: "Something Went wrong", data: {err} });
        }
        else{
          res.status(200).send({status:200,message:"Data deleted Successfully",data:{}})
        }
      })
    }
    else{
      res.status(404).send({ status: 404, message: "Data Not Found", data: {err} });

    }
  }); 
});


/*Create an API to update service as per the service schema */
app.put("/category/:categoryId/service/:serviceId",verifyToken,(req,res)=>{
  const serviceId=req.params.serviceId;
  const service_name=req?.body?.service_name	?? " ";
  const type=req?.body?.type?? " ";
  const price=req?.body?.price?? " ";
  const sql=`SELECT * FROM service WHERE serviceId='${serviceId}'`;
  connection.query(sql,(err,result)=>{
    if(err){
      res.status(400).send({ status: 400, message: "Something went Wrong", data:{err} });
    }
    else if(result[0]){   
        const sql1=`UPDATE service SET service_name='${service_name}',service_name='${service_name}',type='${type}',price='${price}' WHERE serviceId='${serviceId}' `;
        connection.query(sql1,(err,rows)=>{
          if(err){
            res.status(400).send({status: 400, message: "Something went Wrong", data:{err}})
          }
          else{
            res.status(200).send({ status: 200, message: "Data Updated Successfully", data: rows });
          }
        });
    }
    else{
      res.status(404).send({status:404,message:"Data Not Found",data:{}});
    }
  });
});






app.listen(port, () => {
  console.log(`Server is runnig at http://localhost:${port}`);
});


