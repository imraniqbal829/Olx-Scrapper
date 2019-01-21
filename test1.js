const puppeteer = require('puppeteer');

const fs = require('fs');

var request = require('request');



//TODO: GETTING THE URLS FORM THE FILE
var data = process.argv.slice(2);
var url = [];
var files = [];

data.forEach(function(value) {
    
    if(value.includes("http")) {
        url.push(value);
    }else {
        files.push(value);
    }
});

url.forEach(function(element) {
    console.log("URI : "+element);
});

files.forEach(function(element) {
  console.log("FILE : "+element);
});



require('dns').resolve('www.google.com', function(err) {
  if (err) {
     console.log("No connection");
  } else {
     console.log("Connected");
     var hrefs = [];
     var hrefs_file = [];
     var textFile = [];
     
var checkButton = 1;
(async function main() {
  try {

    var dataArr = [];
    

            const browser = await puppeteer.launch({args: ["--proxy-server='direct://'", '--proxy-bypass-list=*'], headless: true})

            const page = await browser.newPage();
            page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36');
            await page.setViewport({ width: 1600, height: 1200});
        
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if( req.resourceType() == 'font' || req.resourceType() == 'image'){
                    req.abort();
                } else {
                    req.continue();
                }
            });
        
            
            console.log(url.length);
            for(var x = 0; x<url.length; x++) {

                
                console.log("url NO. : "+x+" : "+url[x]);
                await page.goto(url[x].toString());
                if(x == 0) {
                
                await page.click('.rui-3jazr, .rui-1XUas, .rui-3_XwO');
                
                }
                console.log("taking screenshot of list of ads");
            
                //TODO: finding Load more button and click all of them
                
                var loadMoreBtn = 1;
                const text = 'LOAD MORE';
                var numOfAds = 0;
                var addUrls = [];
                
                var hrefs_temp_2 = [];
                console.log("Check Button "+checkButton);
                while(checkButton == 1) {
                  try {
                    await page.waitForFunction(
                      text => document.querySelector('body').innerText.includes(text),
                      {},
                      text
                    );
                    await page.waitFor(300);
                    await page.waitForSelector('.\_1g25P > div > .JbJAl > .rui-3sH3b > span');
                    await page.evaluate(()=>document.querySelector('.\_1g25P > div > .JbJAl > .rui-3sH3b > span').click());
            
                    
                    
                    await page.waitForSelector('.EIR5N > a ');
                    var hrefs_temp = await page.evaluate(() => {
                      const anchors = document.querySelectorAll('.EIR5N > a ');
                      return [].map.call(anchors, a => a.href);
                    });
                    for (i = 0; i < hrefs_temp.length; i++){
                      hrefs.push(hrefs_temp[i]);
                      hrefs_file.push(files[x].toString());
                      
                    }
                      console.log("Pushing detected");
                      
                      console.log(hrefs.length);
            
                    
                    if( loadMoreBtn > 0) {
                      
                      //TODO: DELETING ADDS
                      let div_selector_to_remove= ".EIR5N";
                      await page.evaluate((sel) => {
                        var elements = document.querySelectorAll(sel);
                        for(var i=0; i< elements.length; i++){
                          elements[i].parentNode.removeChild(elements[i]);
                        }
                      }, div_selector_to_remove)
                      
                    }
                    console.log("Clicked Load More" + loadMoreBtn);
                    loadMoreBtn++;
                  }catch(e) {
                      if (x == url.length-1){
                        await browser.close();
                        console.log("browser closed");
                        checkButton = 0;
                      } else {
                          checkButton = 2;
                      }
                    
                    console.log(`The text "${text}" was not found on the page`);
                  }

                  
                             
                }
              
                if (checkButton == 0) {
                  console.log("Jhuley laal"); 
              var processItems = function(x){
                if( x < hrefs.length ) {
                  request(hrefs[x], function (error, response, html) {
                    if (!error && response.statusCode == 200) {
                      
                      //TODO: regex of number
                      var myRegexp = /(\+92([0-9]{10}))/mg;
                      var match = myRegexp.exec(html)
                      //TODO: checking if number is presesnt or not
                      if (match != null && match[0].length == 13 ){
                        
                        //TODO: writing numbers to file
                        fs.appendFile("output/"+hrefs_file[x]+".txt", match[0]+"\r\n", function(err) {
                          if(err) console.log(err);
                           
                          });
                      }
                      console.log("counter value = "+x+ " / "+hrefs.length);
                      if (x == hrefs.length-1){
                        console.log("Mubarak ho aap papa bangae");
                      } else {
                        processItems(x+1);
                      }
                      
                    } else {
                      processItems(x);
                    }
                  });
                }
              };
  
              processItems(0);
                  console.log("total urls "+hrefs.length);
                  console.log("total filenames "+hrefs_file.length);
                  console.log("Done with writing url");
  
                }
              
                checkButton = 1;

            }
  
  }
  catch(e) {
    console.log("Error " , e);
  }

})();
  }
});