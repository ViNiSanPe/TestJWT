require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const LINK_DB = process.env.MONGO_LINK
const SALTN = process.env.SALTN


const app = express()
app.use(express.json())

const User = require('./models/User')

app.post('/auth/register', async (req, res) => {
    const { name, email, pswd, confirmPswd } = req.body

    const userExists = await User.findOne({ email: email })

{
    if (userExists) return res.status(422).json({ msg: "Email já cadastrado, use outro."})
    if (!name) return res.status(422).json({ msg: "o campo name é obrigatório." })
    if (!email) return res.status(422).json({ msg: "o campo email é obrigatório." })
    if (!pswd) return res.status(422).json({ msg: "o campo pswd é obrigatório." })
    if (!confirmPswd) return res.status(422).json({ msg: "o campo confirmPswd é obrigatório." })
    if (pswd !== confirmPswd) return res.status(422).json({ msg: "os campos pswd e confirmPswd não são iguais." })
}

{
    const salt = await bcrypt.genSalt(SALTN)
    const pswdHash = await bcrypt.hash(pswd, salt)
}

const user = new User({
    name,
    email,
    pswd
})

try {
    await user.save()

    res.status(201).json({msg: "User criado com sucesso."})

} catch(error) {
    res.status(500).json({msg: error})
}

})

app.get('/', (req, res) => {
    res.status(200).json({ msg: "opa" })
})

mongoose.connect(LINK_DB)
    .then(() => console.log("sucesso irmao"))
    .catch((err) => console.log(err))

app.listen(3000)