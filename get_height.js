const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

//gets the maximum and minimum heights for today's date, ready to be sent in index
module.exports.get_height = function(site_name, date_today){
   return new Promise((resolve, reject) => { 
    //opens the database
    sqlite.open({
          filename: 'sea_the_tide.sqlite3',
          driver: sqlite3.Database
      }).then(database => {
            //logs the site and date
            console.log(site_name, date_today)
            //SQL query ran to get the data using the specified parameters (date, site_name) and resolves the data back, to be sent to the router           
            database.all(`SELECT * FROM ${site_name}_predicted WHERE CAST(datetime AS INTEGER) > ${date_today}0000 AND CAST(datetime as INTEGER) < ${date_today}2359 ORDER BY tide_height DESC, datetime ASC`)
                .then(rows =>{ console.log(`What the haircut ${site_name}`); resolve([rows[0], rows[rows.length-1]])}).catch(err => reject(err))
        }).catch(err=> reject(err))
    })
}