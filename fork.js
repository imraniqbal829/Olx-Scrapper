const cp = require('child_process');
var csv = require('fast-csv');
const fs = require('fs');

var dataArr = [];
csv
.fromPath("URL/olx-url.csv")
.on("data", function(data){
    
    for(var j= 0 ; j<data.length; j++) {
        
        dataArr.push(data[j]).toString();
       
    }    

})
.on("end", async function(){
   
    var res = [];
    var fname = [];
    var url = [];
    for(var i =0; i<dataArr.length; i++) {
        
         res.push(dataArr[i].split(",")).toString();
    }
    
    var child = cp.fork("./test1.js",res);
    child.on("exit", () => {
        console.log("child terminated");
    });
    


});
