const Users = require("../models/userModel.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require('fs')

const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email', 'role', 'picture']
        })
        res.json(users)
    } catch (error) {
        console.log(error);
    }
}
const getUsersId = async (req, res) => {
    try {
        const users = await Users.findOne({ where: { id: req.params.id } })
        res.json(users)
    } catch (error) {
        console.log(error);
    }
}
const getSuper = async (req, res) => {
    try {
        const users = await Users.findOne({ where: { role: req.params.super } })
        res.json(users)
    } catch (error) {
        console.log(error);
    }
}

const Register = async (req, res) => {
    const { name, email, password, confPassword, role, picture } = req.body

    if (password !== confPassword) return res.status(400)
        .json({ msg: "Password dan Confirm Password tidak cocok" })

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            name, email, password: hashPassword, role, picture
        })
        res.json({ msg: "Register Berhasil" })
    } catch (error) {
        console.log(error)
    }
}
const UpdateUser = async (req, res) => {
    const { name, email, password, confPassword, role, picture } = req.body

    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    })
    const filepath = '../frontend/public/assets/uploads/' + user.picture

    if (password !== confPassword) return res.status(400)
        .json({ msg: "Password dan Confirm Password tidak cocok" })

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.update({
            name, email, password: hashPassword, role, picture
        }, {
            where: {
                id: req.params.id
            }
        })
        res.json({ msg: "Register Berhasil" })
        if (picture != null) {
            if (user.picture != "default.png") {
                fs.unlink(filepath, err => console.log(err))
            }
        } else {
            console.log("Tidak Menghapus Gambar")
        }
    } catch (error) {
        console.log(error)
    }
}

const UpdatePass = async (req, res) => {
    const { password, confPassword, passwordLama } = req.body
    const salt = await bcrypt.genSalt();

    const user = await Users.findAll({
        where: {
            id: req.params.id
        }
    })

    const match = await bcrypt.compare(passwordLama, user[0].password)

    if (!match) return res.status(400).json({ msg: "Password Lama Tidak Cocok!!" })

    if (password !== confPassword) return res.status(400)
        .json({ msg: "Password dan Confirm Password tidak cocok" })

    const hashPassword = await bcrypt.hash(password, salt)

    try {
        await Users.update({
            password: hashPassword
        }, {
            where: {
                id: req.params.id
            }
        })
        res.json({ msg: "Register Berhasil" })
    } catch (error) {
        console.log(error);
    }
}
const UpdateEmail = async (req, res) => {
    const { email } = req.body
    try {
        await Users.update({
            email
        }, {
            where: {
                id: req.params.id
            }
        })
        res.json({ msg: "Register Berhasil" })
    } catch (error) {
        console.log(error);
    }
}
const UpdateProfil = async (req, res) => {
    const { picture } = req.body

    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    })
    const filepath = '../frontend/public/assets/uploads/' + user.picture
    try {
        await Users.update({
            picture
        }, {
            where: {
                id: req.params.id
            }
        })
        res.json({ msg: "Update Berhasil" })
        if (picture != null) {
            if (user.picture != "default.png") {
                fs.unlink(filepath, err => console.log(err))
            }
        } else {
            console.log("Tidak Menghapus Gambar")
        }
    } catch (error) {
        console.log(error)
    }
}

const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) return res.status(400).json({ msg: "Wrong Password" })
        const userId = user[0].id;
        const name = user[0].name;
        const picture = user[0].picture;
        const role = user[0].role;
        const email = user[0].email;
        const accesstoken = jwt.sign({ userId, name, email, picture, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })
        const refreshtoken = jwt.sign({ userId, name, email, picture, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1D'
        })
        await Users.update({ refresh_token: refreshtoken }, {
            where: {
                id: userId
            }
        })
        res.cookie('refreshToken', refreshtoken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json({ accesstoken })
    } catch (error) {
        res.status(404).json({ msg: "Email tidak ditemukan" })
    }
}

const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })
    if (!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}

const DeleteUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                id: req.params.id
            }
        })


        const users = await Users.destroy({
            where: {
                id: req.params.id
            }
        })
        if (users === 0)
            res.status(404).json({ msg: "Data Tidak di temukan!" })
        else {
            const filepath = '../frontend/public/assets/uploads/' + user.picture

            if (user.picture != 'default.png') {
                fs.unlink(filepath, err => console.log(err))
            }
            res.json({ msg: "Data Berhasil Terhapus" })
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getSuper,
    getUsers,
    getUsersId,
    DeleteUser,
    Login,
    Logout,
    Register,
    UpdateEmail,
    UpdatePass,
    UpdateProfil,
    UpdateUser
}