const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const router = require("./routes/index.js")
const cookieParser = require("cookie-parser")
const multer = require('multer')
const bodyParser = require("body-parser")
const path = require("path")

dotenv.config()
const app = express()
const port = 9076;


app.use(bodyParser.urlencoded({ extended: true }))


try {
    console.log("Database Connected");
} catch (error) {
    console.log(error)
}


app.use(cors({ credentials: true, origin: 'http://localhost:8076' }))
app.use(cookieParser())
app.use(express.json())
app.use(router)

// Upload File Profile
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/public/assets/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const uploads = multer({ storage })

// add
app.post("/img/uploads", uploads.single('photo'), (req, res) => {
    // membuat URL gambar
    // save ke db
    const finalImageURL = req.protocol + "://localhost:8076/assets/uploads/" + req.file.filename
    res.json({ status: "success", image: finalImageURL, name: req.file.filename })
    // res.json({ status: "success", image: finalImageURL })
})





app.listen(port, () => console.log(`Server running at port ${port}`))