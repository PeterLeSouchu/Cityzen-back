// TIERCE MODULES
import { Router } from "express";


// SignoutController has its own class because it has additional methods and has not need do data from DB. So now we dont use a Singleton for the moment (maybe after)
const signoutController = new signoutController();

const signoutRouter = Router();

signoutRouter.route('/')
  // For disconnect the user and remove the session and destroy the JWT
  .post(signoutController.disconnect);
  
export default signoutRouter;