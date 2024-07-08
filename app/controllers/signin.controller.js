// TIERCE MODULES
import bcrypt from 'bcrypt';


import userDatamapper from "../models/user.datamapper.js";

const signinController = {

  async login(req, res) {
    const { email, password } = req.body;

    const userExist = await userDatamapper.show(email);
    if(!userExist) {
      console.log(userExist);
      return res.status(400).json({error: 'The provided informations is wrong'});
    }

    const passwordHashFromDB = userExist.password;

    const isGoodPassword = await bcrypt.compare(password, passwordHashFromDB);
    if(!isGoodPassword) {
      return res.status(400).json({error: 'The provided informations is wrong'});
    }

    delete userExist.password;

    res.status(200).json({data: [userExist]});
  }
}

export default signinController;