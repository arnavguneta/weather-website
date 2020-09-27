const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// paths for express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// handlebars setup
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static dir to serve
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Arnav Guneta'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Arnav Guneta'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'poop',
        title: 'Help',
        name: 'Arnav Guneta'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error)
            return res.send({
                error: 'Something went wrong parsing your location'
            })

        forecast(latitude, longitude, (error, forecastData) => {
            if (error)
                return res.send({
                    error: 'Something went wrong fetching forecast data'
                })

            res.send({
                address: req.query.address,
                forecast: forecastData,
                location
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help article not found',
        name: 'Arnav Guneta',
        message: 'The help page you were looking for was not found. Try again by going back to the help page.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found',
        name: 'Arnav Guneta',
        message: 'The page you were looking for was not found. Try again by going back to the weather page.'
    })
})

app.listen(port, () => {
    console.log('server is up on port ' + port)
})