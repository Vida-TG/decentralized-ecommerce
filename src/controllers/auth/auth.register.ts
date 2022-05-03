import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../../models/User1';
1;
import bcrypt from 'bcryptjs';
/*
interface User {
  _id: ObjectId, 
  username:string, 
  password:string 
}
*/
export default async (req: Request, res: Response) => {
  try {
    const {
      email,
      username,
      password,
    }: { email: string; username: string; password: string } = req.body;
    // Check if req body is valid
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).send({ message: errors.array()[0].msg });

    // check if username or email exists
    const email_exists = await UserModel.findOne({ email });
    const user_exists = await UserModel.findOne({ username });
    if (email_exists || user_exists)
      return res
        .status(400)
        .send({ message: 'Username or email address already exists ' });
    // Add user if no user exist with email or username
    /* Hash password */
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({});
    console.log(user);
    console.log({ email, username, password: password, Hpassword: hashPassword });
    res.status(201).send({ message: 'Registered  ® ' });
  } catch (err) {
    res.status(500).send({ message: 'An error Occurred' });
  }
};
