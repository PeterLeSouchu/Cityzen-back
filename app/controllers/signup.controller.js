// TIERCE MODULES
import "dotenv/config";
import bcrypt from 'bcrypt';
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// EXTERNAL MODULES
import userDatamapper from "../models/user.datamapper.js";


const signupController = {

  sendOTP(req, res) {
    const { email, password, pseudo } = req.body;
    const OTP = otpGenerator.generate(6, {

    });

    console.log(OTP);

    req.session.signupDatas = {
      email,
      password,
      pseudo,
      OTP,
    }

    // Make the transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const htmlCode = `
      <h1> CityZen </h1>
      <p>Bonjour ${pseudo},</p>
      <p>Nous vous souhaitons la bienvenue chez CityZen! </p>
      <p>Pour valider votre inscription, il ne vous suffit plus qu'à renseigner le code suivant sur la plateforme: <span>${OTP}</span></p>
      <p>À tout de suite !</p>
    `;

    async function sendMail(transporter, htmlCode) {
      // Send mail with defined transporter object
      try {
        const info = await transporter.sendMail({
          from: `"Ryad - Equipe CityZen" <cef>`, // sender address
          to: "r.chair@hotmail.fr", // list of receivers
          subject: "CityZen - Votre code de confirmation", // Subject line
          // text: "Hello world?", // plain text body
          html: htmlCode, // html body
        });
        
        console.log("Message sent: %s", info.messageId);

      } catch (err) {
        console.log('Send message error:', err);
        res.status(500).json({error: err})
      }
    }

    // sendMail(transporter, htmlCode);

    res.status(200).json({info: 'OTP sented'});
  },

  async checkUserByOTP(req, res) {
    if(!req.session?.signupDatas) {
      res.status(404).json({error: 'Bad Request'})
    }

    const { email, password, pseudo, OTP } = req.session.signupDatas;
    const sendedOTP = req.body.OTP;

    if(OTP !== sendedOTP) {
      res.status(400).json({error: 'The OTP does not match'});
    }

    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    const createdUser = await userDatamapper.save(email, hash, pseudo);
    // const createdUser = [{id: 2, email, hash}];

    res.status(200).json({data: createdUser});
  }
}

export default signupController;