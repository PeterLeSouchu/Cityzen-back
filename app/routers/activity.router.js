// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import activityController from "../controllers/activity.controller.js";


const activityRouter = Router();

activityRouter.route('/')
  .post(activityController.store);

activityRouter.route('/:id')
  .patch(activityController.update)
  .delete(activityController.destroy);

activityRouter.route('/:country/:city')
  .get(activityController.index);

activityRouter.route('/rating')
  .get(activityController.index);


activityRouter.route('/recent')
  .get(activityController.index);


export default activityRouter;