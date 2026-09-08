require("dotenv").config();
const express=require("express");const cors=require("cors");const helmet=require("helmet");const multer=require("multer");
const authRoutes=require("./auth/authRoutes");const pool=require("./app/db");const axios=require("axios");const inspectionRoutes=require("./app/inspectionRoutes");const qrRoutes=require("./app/qrRoutes");
const app=express();const port=Number(process.env.PORT||5000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) { console.error("JWT_SECRET must be set to at least 32 characters."); process.exit(1); }
app.use(helmet());app.use(cors({origin:process.env.FRONTEND_URL||"http://localhost:5173",credentials:true}));app.use(express.json({limit:"1mb"}));
app.use("/uploads", express.static(require("path").resolve(process.env.UPLOAD_DIR || require("path").join(__dirname,"uploads")), { maxAge: "1d", index: false }));
app.get("/",(_req,res)=>res.json({service:"PackSure API",status:"ok",version:"1.0.0"}));
app.get("/api/health",async(_req,res)=>{const result={status:"ok",database:"unknown",aiService:"unknown"};try{await pool.query("SELECT 1");result.database="ok";}catch{result.database="error";result.status="degraded";}try{await axios.get(process.env.AI_SERVICE_URL||"http://localhost:8000",{timeout:3000});result.aiService="ok";}catch{result.aiService="error";result.status="degraded";}res.status(result.status==="ok"?200:503).json(result);});
app.use("/api/auth",authRoutes);app.use("/api/inspections",inspectionRoutes);app.use("/api/qr",qrRoutes);
app.use((err,_req,res,_next)=>{if(err instanceof multer.MulterError)return res.status(400).json({message:err.message});console.error(err);res.status(500).json({message:"Internal server error"});});
app.listen(port,()=>console.log(`PackSure API running on http://localhost:${port}`));
