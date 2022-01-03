const PORT = process.env.PORT || 8000; //for deploy on heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const newspapers = require('./newspapers')

const app = express(); 
const articles = []
const specArticle = []

newspapers.forEach(newspaper => {
        
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data; 
         
        const $ = cheerio.load(html)
      
        $('a:contains("Путин")', html).each(function(){
            const title = $(this).text(); 
            const url = $(this).attr('href')
            articles.push({
                title, 
                url, 
                sourse: newspaper.name
            })
        })
        
    }).catch((ex) => console.log(ex)); 
    
})

 

app.get('/', (req, res) => {
    res.json('Welcome to my climate News API')
})


app.get('/news', (req, res) => {
    res.json(articles)  
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId; 
   
    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)
     
    axios.get(newspaper[0].address)
        .then(response => {
            const html = response.data; 
            const $ = cheerio.load(html)
           

            $('a:contains("Путин")', html).each(function(){
                const title = $(this).text(); 
                const url = $(this).attr('href')
                specArticle.push({
                    title,
                    url,
                    sourse: newspaper[0].name
                }); 
            })
 
    }).catch((ex) => console.log(ex)); 
    
     res.json(specArticle)
    
})


app.listen(PORT, () => {
    console.log(`server runnit on port ${PORT}`)
})