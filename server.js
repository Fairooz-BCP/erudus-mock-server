const express = require("express");
let app = express();

const bodyParser = require("body-parser");
const path = require('path'); // Used for concatenation to create a path
const singleProducts = require('./data/singleProducts.json') // loads json files of detailed products
const allProducts = require('./data/allProducts.json')


const port = process.env.PORT || 3001;

const access_data ={
    client_id: 1234,
    client_secret: 5678
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })) // Detect url encoded data in http and add to req body
app.use(express.json()); // Detect json data and put it into the req.body


// setting up home page
app.get('/', async (req, res, next) =>{

    // res.sendFile('./view/html/home.html', { root: __dirname }); // path is relative to the execution path __dirname
    res.send(200);

}
)



// get all products
app.get("/api/public/v1/products", (req, res) => {
    res.json(allProducts)
});


// get product with specific id
app.get('/api/public/v1/products/:id', (req, res) =>{
    
    let id = req.params.id; // Use param instead of query string
    const product = singleProducts.data.filter(element => element.id == id);

    if(!product) res.status(404).send('Product with given id not found');
    res.json(product);
})

// request new access token
app.post('/api/access_token', (req, res) =>{

    const { client_id, client_secret} = req.body;
    console.log(req)
    let accessToken ='';
    console.log(client_id)
    console.log(client_secret)

    
    try{

    if( client_id == access_data.client_id 
        && client_secret == access_data.client_secret)
    {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            for(let i=0; i<20; i++){
                accessToken += chars.charAt(Math.floor(Math.random() * chars.length));
            }
           res.json({access_token: accessToken,
                    token_type: "Bearer"})
        
    }    
    } catch(err){
        console.log(err)
        res.status(500);
    }

  

})

app.get('/*', (req, res) =>{
    console.log(req.path)
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

