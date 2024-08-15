// INTERNAL MODULES
import path from 'node:path';

// TIERCE MODULES
import { Router } from 'express';

// EXTERNAL MODULES
import activityRouter from './activity.router.js';
import signinRouter from './signin.router.js';
import signoutRouter from './signout.router.js';
import unsubscribeRouter from './unsubscribe.router.js';
import profilRouter from './profil.router.js';
import forgotPasswordRouter from './forgot-password.router.js';
import signupRouter from './signup.router.js';
import authenticationCheck from '../middlewares/authentication-check.middleware.js';
import countryRouter from './country.router.js';
import cityRouter from './city.router.js';
import { doubleCsrfProtection } from '../config/csrf.config.js';
import deleteImage from '../utils/delete-image.js';

const router = Router();

router.use('/activity', activityRouter);
router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/signout', signoutRouter);
router.use(
  '/unsubscribe',
  authenticationCheck,
  /*doubleCsrfProtection,*/ unsubscribeRouter
);
router.use('/profil', authenticationCheck, profilRouter);
router.use('/forgot-password', forgotPasswordRouter);
router.use('/country', countryRouter);
router.use('/city', cityRouter);
// TODO : 404 middleware here 👇

// Error handler middleware
router.use((error, req, res, next) => {
  let { message, errorType, name } = error;

  console.log('Une erreur est survenue: ', error);
  console.log(
    "Voici les propriétés de l'erreur disponible: ",
    Object.getOwnPropertyNames(error)
  );

  // If the error comes from adding an activity, we delete the image
  if (req.session.imageName) {
    const imageDirname = path.join(
      import.meta.dirname,
      '../../public',
      'images'
    );
    const imagePath = path.join(imageDirname, req.file.filename);
    deleteImage(imagePath);
  }
  delete req.session.imageName;

  if (name === 'ValidationError') {
    res.status(404).json({
      error: {
        message: 'The provided information is wrong',
        originalMessage: error.message,
      },
    });
    return;
  }

  res.status(errorType?.status || 500).json({
    error:
      message || 'Internal Server Error. Please, contact your administrator',
  });
});

export default router;
