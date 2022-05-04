import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//import {User} from "../../../types/models"

export default async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
    }: { email: string, password: string } = req.body;
    // Check if req body is valid
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).send({ message: errors.array()[0].msg });

    // check if  email exists
    const email_exists = await UserModel.findOne({ email });
    if (email_exists){
      const right_password = await bcrypt.compare(password, email_exists.password )
      
    /* Send token */
    const SECRET = process.env.SECRET ?? '';
    if(right_password) {
    const token = await jwt.sign({ id: email_exists._id }, SECRET);
      return res.status(200).send({message:"Logged in successfully", token })
    } // if password is correct 
    } // block end of exists 
      
      res.status(400).send({ message: 'Incorrect email address or password' });
    
  } catch (err) {
    res.status(500).send({ message: 'An error Occurred' });
  }
};
