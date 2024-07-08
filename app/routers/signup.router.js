// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import signupController from "../controllers/signup.controller.js";
import validationSchema from "../schema-validations/validation.schema.js";
import signupAuthenticationSchema from "../schema-validations/signup/signup.authentication.schema.js";

const signupRouter = Router();

signupRouter.route('/')
  // For check user identity with his email and password we send an OTP code by email
  .post(validationSchema(signupAuthenticationSchema), signupController.sendOTP)

signupRouter.route('/confirmation')
  // For check the received OTP code and signup the user in DB if ok
  .post(validationSchema(signupAuthenticationSchema), signupController.checkUserByOTP);
  
export default signupRouter;