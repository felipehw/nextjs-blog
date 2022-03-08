import { NextApiRequest, NextApiResponse } from 'next'

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default function handler(req, res) {
    res.status(200).json({ text: 'Hello'});
}