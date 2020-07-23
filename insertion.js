const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const csv = require('fast-csv');

//function to parse csv file data, ready to go into the database
module.exports.csv_parse = function(site_name){
  return new Promise((resolve, reject) => {
    tide_data = [];
    //logs the site being parsed
    console.log(`Yes ${site_name}`)
    site_name_csv = `${site_name}.csv`
    csv.parseFile(site_name_csv)
      .on('data', data => {
        //console.log(data)
        //determines if the line in the csv file is appropriate for parsing or not
        if (data[0] === undefined) return
        if (data.length == 0) return
        if (!data[0].match(/\d{12}/)) return
        //splits data with parameters
        row = data[0].split(/\s+/)
        //pushes the parsed data, to be used by later functions
        tide_data.push({
          datetime: row[0],
          tide_height: row[1]
        })
      })
      .on('end', function(){
        resolve(tide_data)
      })
      .on('error', err => reject(err))
    })
};
  
//function to insert the previously parsed data into the database
database_insertion = function(site_name, datetime, tide_height){
    return new Promise((resolve, reject) => { 
      //opens the database connection
      sqlite.open({
            filename: 'sea_the_tide.sqlite3',
            driver: sqlite3.Database
        }).then(database => {
          // SQL query ran to place the data into the database     
              database.run(`INSERT OR IGNORE INTO ${site_name}_predicted (datetime, tide_height) VALUES (?, ?)`, datetime, tide_height)
                .then(resolve()).catch(err => reject(err))
        })
    })
}

//function combining the parse and insertion functions, used in index
module.exports.parse_insertion = function(site_name){
  return new Promise((resolve, reject) => {
    //uses the csv_parse function for the specified site  
      module.exports.csv_parse(site_name).then(async data => {
          for (let i in data){
              row = data[i]
              //uses the database_insertion function to insert the parsed data into the specified site's database table
              await database_insertion(site_name, row['datetime'], row['tide_height'])
                  .catch(err => reject(err))
          }
          resolve()
      })
  })
};