const {Pool}=require("pg");

const rawConnectionString=process.env.DATABASE_URL;
let connectionString=rawConnectionString;

if(rawConnectionString){
  try{
    const url=new URL(rawConnectionString);
    url.searchParams.set("sslmode","require");
    connectionString=url.toString();
  }catch{
    connectionString=rawConnectionString;
  }
}

const pool=new Pool({
  connectionString,
  ssl:{rejectUnauthorized:false}
});

module.exports=pool;
