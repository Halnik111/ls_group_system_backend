import db from '../postgres.js';
import knex from "knex";

export const getAllActiveWork = async (req, res) => {
    try {
        
        res.status(200).json()
    }
    catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const getAllWork = async (req, res) => {
    try {
        await db('work')
            .join('vehicles', 'work.vehicle_id', 'vehicles.id')
            .then(data => {
                res.status(200).json(data)
            });
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
};

export const getWork = async (req, res) => {
    try {

        res.status(200).json()
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
};

export const modifyWork = async (req, res) => {
    try {

        res.status(200).json()
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
};

export const deleteWork = async (req, res) => {
    try {

        res.status(200).json()
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
};

export const addWork = async (req, res) => {
    try {
        const body = req.body;
        const test = await db('users').insert({name: body.name, password: body.password, created_on: body.created_on})
        res.status(201).json('done');
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
};

