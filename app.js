"use strict";
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const fs=require('fs');
const fileUpload = require('express-fileupload');
//const { exec } = require('child_process');
//const { spawn }= require('child_process');
const exec= require('child_process').exec;
const spawn= require('child_process').spawn;

 
var sourceflag=1;

app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: true}));
//app.set("view engine", "ejs");
app.use(express.static(__dirname+"/imp_public"));


//var datadir="somefolder/result_test50.json"
var datadir="";



app.get("/impres/index", function(req, res){
   
   
      if(sourceflag===1)
    {
        res.render("homepage.ejs");
    }
    else
    {
        sourceflag=1;
        res.render("index.ejs",{folder:datadir}); 
        
    }
});

app.get("/impres/:jobname1/:jobname2/:jobname3",function(req,res){
    var des="/"+req.params.jobname1+"/"+req.params.jobname2+"/"+req.params.jobname3+"/";
    
    console.log(sourceflag);
      if(fs.existsSync("imp_public"+des+"result.json"))
 //    if(sourceflag==2)
    {   
        console.log("found file");
     
      return res.render("index.ejs",{folder:des}); 
    }
    else{
   
   console.log("didnt found after 10s");
//    return res.redirect('https://impres-luke87.c9users.io/impres'+des);
     setTimeout(function() {
     return res.redirect('http://digbio.missouri.edu/impres'+des);
    }, 30000);
//   return res.render(req.originalUrl);
    }
  
   
   
});

app.get("/impres", function(req, res){
    res.render("homepage.ejs");
});

app.get("/impres/info", function(req, res){
    res.render("info.ejs");
});

app.get("/impres/tool", function(req, res){
    res.render("tool.ejs");
});

app.get("/impres/job", function(req, res){
    res.render("job.ejs");
});

app.get("/impres/tutorial", function(req, res){
    res.render("tutorial.ejs");
});
// app.get("/impres/running", function(req, res){
    
//     if(sourceflag===1)
//     {
//         res.render("homepage.ejs");
//     }
//     else
//     {
//         sourceflag=1;
//         res.render("running.ejs");
        
//     }

// });
app.get("/impres/dlcase",function(req, res) {
    res.download("./imp_public/imp_result/yeast case control sample data.zip");
});
app.get("/impres/dltime",function(req, res) {
    res.download("./imp_public/imp_result/yeast time series sample data.zip");
});


// app.get("/campgrounds", function(req, res){
//     res.render("campgrounds.ejs",{campgrounds:campgrounds});
// });
app.post("/impres/tool",function(req, res) {
    var date = new Date();
    var organism = req.body.organism;
    var time=date.getTime();
    var folder="./imp_public/imp_result/"+organism+"/"+time;
    exec('mkdir '+folder, (err, stdout, stderr) => {
        if (err) {
        return;
        }
        
    var comfolder="./imp_public/imp_result/"+organism+"/";
    var temfolder=time+"/";
    console.log(req.body);

//     req.file('file_input').upload(options, function (err, uploadedFiles) {
//         if (err) return cb(err);
//         if (_.isEmpty(uploadedFiles)) return cb();
//         // A file was attached do 
// });
    
    if (!req.files)
    {
        console.log("no file uploaded");
    }
    
    if (req.files.genelist)
    {
        console.log("genelist detected");
        let genelist = req.files.genelist;
        genelist.mv(comfolder+temfolder+'rawlist.txt', function(err) {
        if (err)
        console.log(err.message);
        });
        var para=comfolder+" "+comfolder+temfolder;
        exec('java -jar ./getlist.jar '+para, (err, stdout, stderr) => {
        if (err) {
            console.log(err.message.toString());
            res.send("error");
            return;
        }
        
        var file =comfolder+temfolder + 'rawlist_converted.txt';
        res.download(file); // Set disposition and send it.
        });
        
    }
    else if(req.files.expfile)
    {
        console.log("expfile detected");
        let expfile = req.files.expfile;
        expfile.mv(comfolder+temfolder+'rawexp.txt', function(err) {
        if (err)
        console.log(err.message);
        });
        var para=comfolder+" "+comfolder+temfolder;
        exec('java -jar ./getexp.jar '+para, (err, stdout, stderr) => {
        if (err) {
            console.log(err.message.toString());
            res.send("error");
            return;
        }
        
        var file =comfolder+temfolder + 'rawexp_converted.txt';
        res.download(file); // Set disposition and send it.
        });
    }
    });
});


app.post("/impres/running", function(req, res){
    var date = new Date();
    var organism = req.body.organism;
    var time=date.getTime();
    var folder="./imp_public/imp_result/"+organism+"/"+time;
    exec('mkdir '+folder, (err, stdout, stderr) => {
        if (err) {
        return;
        }
        
    var comfolder="./imp_public/imp_result/"+organism+"/";
    var temfolder=time+"/";
    var target_radio=req.body.radiotarget;
    var datatype=req.body.dataradio;
    var num1=1;
    var num2=1;
    var backnet="output_net.txt";
    var ifcon="no";
    
    var seedfilename=temfolder+"seedfile.txt";
    var expfilename=temfolder+"expfile.txt";
    var outfilename=temfolder+"result";
    var profilename=temfolder+"proexpfile.txt";
    var topnum="1";
    var ifend="no";
    var ifppi="no";
    
    console.log(req.body);

    if (!req.files)
    {
        console.log("no file uploaded");
    }
    
    if (req.body.radioalgo==="option2")
    {
        let profile=req.files.profile;
        profile.mv(comfolder+temfolder+"proexpfile.txt",function(err){
          if (err)
          console.log(err.message);
        });
        datatype="inte_pro";
    }
    
    let seedFile = req.files.seedfile;
    //console.log(seedFile.name);
    seedFile.mv(comfolder+temfolder+'seedfile.txt', function(err) {
        if (err)
        console.log(err.message);
        //res.send('File uploaded!');
    });

    if(target_radio==="option1")
    {
        let targetFile = req.files.targetfile;
        targetFile.mv(comfolder+temfolder+'targetfile.txt', function(err) {
        if (err)
        console.log(err.message);
        ifend=temfolder+'targetfile.txt';
        //res.send('File uploaded!');
    });
    }
    else if(target_radio==="option2")
    {
        topnum=req.body.targetnum;
        ifend="no";
    }
    
    let expFile = req.files.expfile;
    expFile.mv(comfolder+temfolder+'expfile.txt', function(err) {
    if (err)
        console.log(err.message);
    });
    
    if(datatype==="2c_self_tfun1")
    {
         num1=req.body.controlsam;
         num2=req.body.casesam;
    }
    else if(datatype==="time_list_tfun2")
    {
         num1=req.body.timepoint;
         num2=req.body.replicate;
    }
    else if(datatype==="inte_pro")
    {
         num1=req.body.controlsam;
         num2=req.body.casesam;
    }
    
    if(req.body.ppiCheck==='on')
    {
        ifppi="yes";
        
    }
    if (req.body.radioalgo==="option2")
    {
        ifppi="yes";
    }
    //doing tihings
    
    // if(document.querySelector('#ppiCheck').checked)
    // {
    //     ifppi="yes";
    // }
    
    console.log(comfolder+" "+datatype+" "+num1+" "+num2+" "+backnet+" "+ifcon+" "+seedfilename+" "+expfilename+" "+outfilename+" "+topnum+" "+ifend+" "+ifppi+" "+profilename);
    var para=comfolder+" "+datatype+" "+num1+" "+num2+" "+backnet+" "+ifcon+" "+seedfilename+" "+expfilename+" "+outfilename+" "+topnum+" "+ifend+" "+ifppi+" "+profilename;
    
   datadir="/imp_result/"+organism+"/"+temfolder;
    
     exec('Rscript ./rserve.R', (err, stdout, stderr) => {
        if (err) {
            console.log(err.message.toString());
            res.send("error");
            return;
        }
        
        exec('java -jar ./version_11_7_2019.jar '+para, (err, stdout, stderr) => {
        if (err) {
            console.log(err.message.toString());
            res.send("error");
            return;
        }
        console.log(stdout);
        sourceflag=2;
        
 //       res.redirect("/impres/index");
        });
        
        });
        
      return res.redirect('http://digbio.missouri.edu/impres'+datadir);
  
        
    // res.send("running, wait to redirect!");
    
    // get data from form and add to campgrounds array
    // var name = req.body.name;
    // var image = req.body.image;
    // var newCampground = {name: name, image: image}
    // campgrounds.push(newCampground);
    //redirect back to campgrounds page
    
        
        
        
        
        
        
        
        
        
        });
   
});


var server=app.listen(8080, process.env.IP, function(){
   console.log("The IMPRes Server Has Started!");
   console.log(__dirname);

});

