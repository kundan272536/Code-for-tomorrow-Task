const verifyToken=(req,res,next)=>{
    const bearerHeader=req.headers['x-token'];
    if(typeof bearerHeader!=='undefined'){
      const bearer=bearerHeader.split(" ");
      const token=bearer[1];
      req.token=token;
      next();
    }
    else{
      res.send({result:"Token is not valid"});
    }
  }
  module.exports=verifyToken;