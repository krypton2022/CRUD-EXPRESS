// importing mysql modules
const mysql = require("mysql");

// importing express
const express = require("express");

// creating of an application instance
const app=express();


// creating a malware to enable reading of the json document
app.use(express.json());

// connecting to a port
const PORT=4040;

const mysqlconnection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"the_curvedb",
    multipleStatements:true,
});



// connecting to the database
mysqlconnection.connect(()=>{
    console.log("database connected successfully")
});

// testing for an endpoint
app.get("/",(req,res)=>{
    res.send("welcome to express")
});

// creating of a route to get all student
app.get("/students", (req,res)=>{
    mysqlconnection.query("SELECT * FROM studentdata", (err,rows,fields)=>{
        if(!err){
            res.status(200).json({data:rows});
        }else{
            res.status(400).json({message:err.message})
        }
    });

});

//  getting a student
// app.get("/students/:id",(req,res)=>{
//     const id=req.params.id;
//     mysqlconnection.query(`SELECT * FROM studentdata WHERE ID=${id}`,(err,rows,fields)=>{
//         if(!err){
//             res.status(200).json({data:rows});
//         }else if(id==null){
//             res.status(400).json({data:null});
//         }
//         else{
//             res.status(400).json({message:err.message})
//         }
//     } );
// });

// approach 2
// app.get("/students/:id",(req,res)=>{
//     mysqlconnection.query('SELECT * FROM studentdata WHERE id=?',[req.params.id],(err,rows,fields)=>{
//         if(err){
//             console.log(err.message)
//         }else{
//             res.status(200).json({data:rows})
//         }
//     });
// });

// approach 3 using async function
app.get("/students/:id", async(req,res)=>{
    try{
        await mysqlconnection.query("SELECT * FROM studentdata WHERE id=?",[req.params.id],(err,rows,fields)=>{
            if(!err){
                res.status(200).json({data:rows});
            }else{
                res.status(404).json({message:err.message})
            }
        });

    }catch(err){
        res.status(400).json({data:rows});
    }
});

// deleting of a student
app.delete('/students/:id',(req,res)=>{
    let id=req.params.id;
    mysqlconnection.query(`DELETE FROM studentdata WHERE id=${id}`,(err,rows,fields)=>{
        if(err){
            console.log(err.message)
        }else{
            res.status(200).json({message:"successfully deleted"});
        }
    });
});
//  create a new student
app.post("/students",(req,res)=>{
    let student=req.body;
    let sql=`SET @id=?;SET @surname=?;SET @firstname=?;SET @age=?;SET @department=?;
    CALL student(@id,@surname,@firstname,@age,@department);`;
    mysqlconnection.query(sql,[student.id,student.surname,student.firstname,student.age,student.department],(err,rows,fields)=>{
        if(!err){
            rows.forEach((element)=>{
                if(element.constructor==Array){
                    res.status(200).json({
                        message:"new student created sucessfully",
                        data:"student id:" + element[0].id
                    })
                }else{
                    console.log("no student id found")
                }

            });
        }else{
            console.log(err.message)
        }
    });
});

// UPDATE A STUDENT
app.post("/students",(req,res)=>{
\    let sql=`SET@id=?,SET @surname=?,SET@firstname=?,SET@age=?,SET@department=?;
    CALL student(@id,@surname,@firstname,@age,@department);`;
    mysqlconnection.query(sql,[student.id,student.surname,student.firstname,student.age,student.department],(err,rows,fields)=>{
        if(!err){
            res.status(200).json({message:"sucessfully updated"})
        }else{
            res.status(200).json({message:err.message})
        }
    });
})


// listening to port
app.listen(PORT,()=>{
console.log(`listening to port ${PORT}`)
});