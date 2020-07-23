const express = require('express');
const app = express();
const port = 2222;
const {parse_insertion} = require('./insertion')
const {get_height} = require('./get_height')

//sites list and default router
sites = ['brisbane_bar','southport','mooloolaba'];
app.get('/', (req, res) => res.send(
    `Sites available are ${sites[0]}, ${sites[1]}, and ${sites[2]}`));

//async function running database insertion for each site
async function main(){
    await parse_insertion(sites[0]).then(console.log('insertion active')).catch(err => console.error(err));
    await parse_insertion(sites[1]).then(console.log('insertion active')).catch(err => console.error(err));
    await parse_insertion(sites[2]).then(console.log('insertion active')).catch(err => console.error(err));
}

main()

//function to add a zero to the date paramaters if they are a single character
function addzero(dateparam){
    if (dateparam < 10){
        dateparam = `0${dateparam}`
    }
    return dateparam 
} 

//creation of date to be logged in the terminal
let date = new Date;
let wrong_month = date.getMonth();
let correct_month = wrong_month + 1;
let day = addzero(date.getDate());
let month = addzero(correct_month);
let year = date.getFullYear();
let date_today = `${day}${month}${year}`;

//routers for each tide site. runs a function to get the max and min heights of the day using the date and sends it.
app.get(`/${sites[0]}`, function(req, res){
    get_height(sites[0], date_today).then(data => res.send(data)).catch(err => console.log(err))})
app.get(`/${sites[1]}`, function(req, res){
    get_height(sites[1], date_today).then(data => res.send(data)).catch(err => console.log(err))})
app.get(`/${sites[2]}`, function(req, res){
    get_height(sites[2], date_today).then(data => res.send(data)).catch(err => console.log(err))})

//listen and startup log
app.listen(port, () => console.log(`running on port ${port}`));