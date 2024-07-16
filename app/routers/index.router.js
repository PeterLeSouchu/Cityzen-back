// INTERNAL MODULES
import path from "node:path";

// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import activityRouter from "./activity.router.js";
import signinRouter from "./signin.router.js";
import signoutRouter from "./signout.router.js";
import unsubscribeRouter from "./unsubscribe.router.js";
import profilRouter from "./profil.router.js";
import forgotPasswordRouter from "./forgot-password.router.js";
import signupRouter from "./signup.router.js";
import authenticationCheck from "../middlewares/authentication-check.middleware.js";
import countryRouter from "./country.router.js";
import cityRouter from "./city.router.js";
import { doubleCsrfProtection } from "../config/csrf.config.js";
import deleteImage from "../utils/delete-image.js";



const router = Router();

router.use('/activity', activityRouter);
router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/signout', signoutRouter);
router.use('/unsubscribe', authenticationCheck, doubleCsrfProtection, unsubscribeRouter);
router.use( '/profil', authenticationCheck, profilRouter);
router.use('/forgot-password', forgotPasswordRouter);
router.use('/country', countryRouter);
router.use('/city', cityRouter);



// TODO : Handler error middleware here 👇
router.use((error, req, res, next) => {
  let { message, status, name, code } = error;
  console.log('middleware de gestion d\'erreur');
  console.log(status, name, message);
  console.log(error);

  switch (name) {
    case "ValidationError":
      status = 404;
      message = 'Bad request. Invalid value.';

      // If the error comes from adding an activity, we delete the image 
      if(req.session.imageName) {
        const imageDirname = path.join(import.meta.dirname, '../../public', 'images');
        const imagePath = path.join(imageDirname, req.file.filename);
        deleteImage(imagePath);  
      }
      delete req.session.imageName;

    break;
      
    case "BadRequest":
      status = 404;
    break;
        
    default:
      status = 404;
      message = 'Bad request. Invalid value.'
    break;
  }

  switch (code) {
    case '23503':
      status = 403;
      message = 'Request forbidden. This element is attached to an other element'
    break;
  
    default:
      message = 'Internal Server Error. Please contact your administrator.'
      break;
  }


  res.status(status).json({error: message});

})

export default router;