// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import profilController from "../controllers/profil.controller.js";



const profilRouter = Router();

profilRouter.route('/pseudo')
// Check with the JWT and the id from session and change pseudo in DB (use middleware to check user)
  // .patch(profilController.update);

profilRouter.route('/authentication')
// Check with the JWT, the id from session and check password from DB. If correct change new password in DB (use middleware to check user)
  // .patch(profilController.update);

  // To handle favorites of the user
profilRouter.route('/favorite')
  .get(profilController.favorites.index) // toutes les activités entières
  .post(profilController.favorites.store) // l'activité entière
  // .delete(profilController.destroy); // juste l'id

  // To handle created activities of the user
profilRouter.route('/activity')
  // .get(profilController.index)
  // .post(profilController.store)
  // .patch(profilController.update)
  // .delete(profilController.destroy);


export default profilRouter;

/*
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);
 */