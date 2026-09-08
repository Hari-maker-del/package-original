const express=require("express");const multer=require("multer");const authenticateToken=require("../auth/authMiddleware");const {analyzeInspection,listInspections,getInspection,getReport}=require("./inspectionController");const rateLimit=require("./rateLimit");const {validateImageBuffer}=require("./uploadValidation");
const router=express.Router();const max=Number(process.env.MAX_UPLOAD_MB||10)*1024*1024;
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:max},fileFilter:(_req,file,cb)=>cb(null,/^image\/(jpeg|png|webp)$/i.test(file.mimetype))});
router.use(authenticateToken);
router.post("/analyze",rateLimit({max:Number(process.env.ANALYZE_RATE_LIMIT||20),windowMs:15*60*1000,keyGenerator:(req)=>`${req.user?.userId||"anon"}:${req.ip||"unknown"}`}),upload.single("image"),(req,res,next)=>{const check=validateImageBuffer(req.file);if(!check.ok)return res.status(400).json({message:check.message});next();},analyzeInspection);
router.get("/",listInspections);
router.get("/:id/report",getReport);
router.get("/:id",getInspection);
module.exports=router;
