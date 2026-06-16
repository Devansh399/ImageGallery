const { default: mongoose } = require('mongoose');
const app = require('./app')
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI).then(()=>{
    try{
        console.log("Mongoodb connected successfully");
    }catch(error){
       console.error('Mongoodb Conenction error', error);
       process.exit(1);
    }
})



const PORT = process.env.PORT || 5001
app.listen(PORT, ()=>{
    console.log("server is running")
});