const {Pool}=require("pg");

const rawConnectionString=process.env.DATABASE_URL||"";
let connectionString=rawConnectionString;

if(rawConnectionString){
  try{
    const url=new URL(rawConnectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("sslcert");
    url.searchParams.delete("sslkey");
    url.searchParams.delete("sslrootcert");
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
