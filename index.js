const connectToMongo =require('./db');
connectToMongo();
const express = require('express')
const app = express()
app.use(express.json())
const port = 5050


app.use('/api/auth',require('./routes/auth'))
 app.use('/api/notes',require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})