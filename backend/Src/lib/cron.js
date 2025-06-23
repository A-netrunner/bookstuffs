import cron from "cron";
import https from "https";
const API_URL = "https://bookstuffs.onrender.com"
const job = new cron.CronJob("*/14 * * * *",function(){
    https 
        .get(API_URL,(res)=> {
            if(res.statusCode === 200) console.log("Get request send successfully");
            else console.log("get rquest faild ", res.statusCode);
        })
         .on("error",(e)=> console.log("error while sending rquest ",e));
});

export default job; 