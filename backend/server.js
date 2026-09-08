require("dotenv").config();
const express=require("express");
const cors=require("cors");
const helmet=require("helmet");
const multer=require("multer");
const path=require("path");
const https=require("https");
const authRoutes=require("./auth/authRoutes");
const pool=require("./app/db");
const axios=require("axios");
const inspectionRoutes=require("./app/inspectionRoutes");
const qrRoutes=require("./app/qrRoutes");

const app=express();
const port=Number(process.env.PORT||5000);
const internalHttpsAgent=new https.Agent({rejectUnauthorized:false});
axios.defaults.httpsAgent=internalHttpsAgent;
axios.defaults.proxy=false;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set to at least 32 characters.");
  process.exit(1);
}

app.use(helmet());
const allowedOrigins=(process.env.FRONTEND_URL||"").split(",").map(x=>x.trim()).filter(Boolean);
if(process.env.VERCEL_URL)allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
app.use(cors({
  origin:(origin,callback)=>{
    if(!origin || process.env.VERCEL || allowedOrigins.length===0 || allowedOrigins.includes(origin)) return callback(null,true);
    return callback(null,false);
  },
  credentials:true
}));
app.use(express.json({limit:"1mb"}));
app.use("/uploads",express.static(path.resolve(process.env.UPLOAD_DIR||path.join(__dirname,"uploads")),{maxAge:"1d",index:false}));

app.get("/",(_req,res)=>res.json({service:"PackSure API",status:"ok",version:"1.0.0"}));
app.get("/api/health",async(_req,res)=>{
  const result={status:"ok",database:"unknown",aiService:"unknown"};
  try{
    await pool.query("SELECT 1");
    result.database="ok";
  }catch(err){
    result.database="error";
    result.databaseError=process.env.DATABASE_URL?String(err.message||"connection failed").replace(/postgres(?:ql)?:\/\/[^\s]+/gi,"postgresql://***:***@***"):"DATABASE_URL is not set";
    result.status="degraded";
  }
  try{
    const aiUrl=process.env.AI_SERVICE_URL;
    if(!aiUrl){
      result.aiService="error";
      result.aiServiceError="AI_SERVICE_URL is not set";
      result.status="degraded";
    }else{
      const response=await axios.get(aiUrl,{timeout:5000,httpsAgent:internalHttpsAgent,proxy:false,validateStatus:()=>true});
      if(response.status>=200&&response.status<500){
        result.aiService="ok";
      }else{
        result.aiService="error";
        result.aiServiceError=`AI service returned HTTP ${response.status}`;
        result.status="degraded";
      }
    }
  }catch(err){
    result.aiService="error";
    result.aiServiceError=String(err.code||err.message||"connection failed").slice(0,300);
    result.status="degraded";
  }
  res.status(result.status==="ok"?200:503).json(result);
});

app.use("/api/auth",authRoutes);
app.use("/api/inspections",inspectionRoutes);
app.use("/api/qr",qrRoutes);

app.use((err,_req,res,_next)=>{
  if(err instanceof multer.MulterError)return res.status(400).json({message:err.message});
  console.error(err);
  res.status(500).json({message:"Internal server error"});
});

if(require.main===module){
  app.listen(port,()=>console.log(`PackSure API running on http://localhost:${port}`));
}

module.exports=app;
