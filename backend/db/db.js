const mongoose=require('mongoose');
const URL=process.env.URL || "mongodb+srv://arsharma2951:aryan2951@cluster0.i8tyomq.mongodb.net/hrms-portal"
const mongodb=async() => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("database connected")
        
    } catch (error) {
        console.error("error in connection", error)
        
    }
}
module.exports=mongodb;
