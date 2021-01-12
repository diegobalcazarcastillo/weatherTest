//Text decoration 
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
//Utilities
const io = require('console-read-write');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var unirest = require("unirest");
let infotext = `You can use all this commands! 
clear => To clear the screen
weather => Creates an CSV file named weatherTest.csv in the root of this App, it contains the information about Dallas weather at the moment.
info => read this again!
finish => logout from this CLI
`; 

console.log(chalk.yellow(figlet.textSync('Javascript CLI', { horizontalLayout: 'full' })));
console.log(chalk.blue(infotext));

async function main()
{
    
    let cmdFinish = false;
    while(!cmdFinish)
    {
        let command = await io.read();
        switch(command)
        {
           
            case "clear":
                clear();
                break;
            case "info":
                console.log(chalk.blue(infotext));
                break;
            case "weather":
                var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/weather");
                req.query({
                    "q": "Dallas,us",
                    "lat": "0",
                    "lon": "0",
                    "callback": "",
                    "id": "2172797",
                    "lang": "null",
                    "units": "metric",
                    "mode": "xml, html"
                });
                req.headers({
                    "x-rapidapi-key": "1376164dfemsh537e66fee1529c7p1046c1jsn056a00eb61d5",
                    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                    "useQueryString": true
                });
                req.end(function (res) {
                    if (res.error) throw new Error("Problem with Weather.js => " + res.error);
            
                    let temp = res.body.main.temp;
                    let precipitation = res.body.weather[0].description.includes('rain') ? "true" : "false";
                    const csvWriter = createCsvWriter({
                        path: 'weatherTest.csv',
                        header: [
                          {id: 'Temperature', title: 'Temperature'},
                          {id: 'Units', title: 'Units'},
                          {id: 'Precipitation', title: 'Precipitation'}
                        ]
                      });
                    const data = [
                        {
                          Temperature: temp,
                          Units: 'C',
                          Precipitation: precipitation
                        }
                      ];
                      csvWriter
                      .writeRecords(data)
                      .then( () =>
                        console.log(`The CSV file was written successfully
                                    Press any key to continue...`)
                       );
                     
                });
                break;
                case "finish":
                    cmdFinish = true;
                    console.log(chalk.yellow("Bye!"));
                    break;
        }
    }
}

main();