import db from "../postgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const SECRET_KEY = process.env.JWT_KEY;

export const login = async (req, res)=> {
    const {username, password} = req.body;
    try {
        const user = await db('users').where({username: username}).first();
        if (!user) {
            return res.status(401).json({message: 'Invalid username or password'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid username or password'});
        }
        const {password: _, ...userWithoutPassword} = user; // Exclude password
        const token = jwt.sign({id: user.id, created_at: user.created_at, role: user.role}, process.env.JWT_KEY, {expiresIn: '1week'});
        console.log(token);
        console.log(userWithoutPassword);
        console.log(userWithoutPassword)
        res.status(200).json({token, user: userWithoutPassword});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


export const register = async (req, res) => {
    const {username, password} = req.body;
    try {
        const existingUser = await db('users').where({username: username}).first();
        if (existingUser) {
            return res.status(409).json({message: 'Username already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db('users').insert({username, password: hashedPassword, created_at: new Date()}).returning('*');

        const {password: _, ...userWithoutPassword} = newUser; // Exclude password
        const token = jwt.sign({id: newUser[0].id, created_at: newUser[0].created_at, role: newUser[0].role}, process.env.JWT_KEY, {expiresIn: '1week'});
        res.status(201).json({message: 'User created successfully', token, user: userWithoutPassword});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.clearCookie('user');
        res.status(200).json({message: 'Logged out successfully'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}