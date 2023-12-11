const mongoose = require('mongoose');

const signup = (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;
    res.json({ message: "Signup route and controller working" })
}

const login = (req, res) => {
    const { username, password } = req.body;
    res.json({ message: "Login route and controller working" })
}

module.exports = {
    signup,
    login
}