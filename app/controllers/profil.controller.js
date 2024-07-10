import ApiError from "../errors/api.error.js";
import activityDatamapper from "../models/activity.datamapper.js";
import cityDatamapper from "../models/city.datamapper.js";
import profilDatamapper from "../models/profil.datamapper.js";
import makeSlug from "../utils/make-slug.js";


const profilController = {
  RADIX_NUMBER: 10,

  favorites: {
    async index(req, res) {
      // const userId = req.cookies.userId;
      const userId = req.session.userId;

      const activities = await profilDatamapper.favorites.getAll(userId);
  
      res.status(200).json({data: activities});
    },
  
    async store(req, res) {
  
      // const userId = req.cookies.userId;
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.body.id, profilController.RADIX_NUMBER);

      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if(existActivity) {
        const requestError = new ApiError('This activity already exist', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      console.log(userId, activityId);
      const userHasActivity = await profilDatamapper.favorites.getOne(userId, activityId);
      if(userHasActivity) {
        const requestError = new ApiError('This activity already saved', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      // Save favorite in DB for this user
      const activityForUser = await profilDatamapper.favorites.saveFavorite( userId, activityId);

      res.status(201).json({data: existActivity});
  


      // const { title, description, image, address, phone, longitude, latitude, city } = req.body;
  
  
      // // This real slug but now we use the id at the place of the title
      // const slug = makeSlug(title);
      // // const slug = 
      // const userId = req.cookies.userId;
  
      // const createdActivity = await profilDatamapper.create({
      //   title,
      //   description,
      //   image,
      //   address,
      //   phone,
      //   longitude,
      //   latitude,
      //   city,
      //   slug,
      //   userId
      // })
  
      // res.status(201).json({})
  
    },

    async destroy(req, res) {
      // const userId = req.cookies.userId;
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.params.id, profilController.RADIX_NUMBER);
      
      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if(!existActivity) {
        const requestError = new ApiError('This activity already exist', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilDatamapper.favorites.getOne(userId, activityId);
      if(!userHasActivity) {
        const requestError = new ApiError('This activity not saved by the user', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      const removedFavorite = await profilDatamapper.favorites.removedFavorite(userId, activityId);

      res.status(200).json({data: removedFavorite});
    }
  },

  activities: {
    async index(req, res) {
      const userId = req.session.userId;

      const activities = await profilDatamapper.activities.getAll(userId);
  
      res.status(200).json({data: activities});
    },

    async store(req, res) {
      const userId = req.session.userId;
      const {
        title,
        description,
        url,
        image,
        address,
        phone,
        longitude,
        latitude,
        city,
      } = req.body;

      // Faire le slug
      let slug = encodeURIComponent(title.toLowerCase());
      const sameActivityExist = await activityDatamapper.getAllBySlug(slug);
      if(sameActivityExist) {
        slug += `%20${city.toLowerCase()}`;
      }
      
      const sameActivityExistWithCity = await activityDatamapper.getAllBySlug(slug);
      console.log(sameActivityExistWithCity);
      if(sameActivityExistWithCity.length > 0) {
        const numberOfActivities = sameActivityExistWithCity.length;
        slug += `%20${numberOfActivities + 1}`;
      }

      const cityFromDB = await cityDatamapper.getOneByName(city);

      const activityToCreate = {
        slug,
        url,
        title,
        description,
        image,
        address,
        phone,
        longitude,
        latitude,
        userId,
        cityId: cityFromDB.id,
      };

      const createdActivity = await profilDatamapper.activities.create(activityToCreate);

      res.status(201).json({data: [createdActivity]});
    },

    async update(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.params.id, profilController.RADIX_NUMBER);


      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if(!existActivity) {
        const requestError = new ApiError('This activity already exist', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      const cityActivity = await cityDatamapper.getOneById(existActivity.id_city);

      // Check if activity is created by this user
      const createdActivityByUser = await profilDatamapper.activities.getOne(userId, activityId);
      if(!createdActivityByUser) {
        const requestError = new ApiError('This activity not created by this user', {status: 403});
        requestError.name = "Forbidden";
        throw requestError;
      }

      const { title, city } = req.body;

      let slug = '';

      
      if(title || city) {
        let titleForSlug = title ? title : existActivity.title;
        let cityForSlug = city ? city : cityActivity.name; 

        slug = encodeURIComponent(titleForSlug.toLowerCase());
        const sameActivityExist = await activityDatamapper.getAllBySlug(slug);
        if(sameActivityExist) {
          slug += `%20${cityForSlug.toLowerCase()}`;
        }
        
        const sameActivityExistWithCity = await activityDatamapper.getAllBySlug(slug);
        console.log(sameActivityExistWithCity);
        if(sameActivityExistWithCity.length > 0) {
          const numberOfActivities = sameActivityExistWithCity.length;
          slug += `%20${numberOfActivities + 1}`;
        }
      }

      const cityFromDB = city ? await cityDatamapper.getOneByName(city) : cityActivity;

      const activityToUpdate = {
        ...req.body,
        slug,
        title: existActivity.title,
        cityId: cityFromDB.id
      };
      delete activityToUpdate.city;

      const updatedActivity = await profilDatamapper.activities.update(activityToUpdate, activityId);

      res.status(200).json({data: [updatedActivity]});
    },

    async destroy(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.params.id, profilController.RADIX_NUMBER);

      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if(!existActivity) {
        const requestError = new ApiError('This activity already exist', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilDatamapper.activities.getOne(userId, activityId);
      if(!userHasActivity) {
        const requestError = new ApiError('This activity not saved by the user', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      const removedActivity = await profilDatamapper.activities.removeActivity(userId, activityId);

      res.status(200).json({data: removedActivity});
    },

  },

  ratings: {
    async index(req, res) {
      const userId = req.session.userId;

      const userActivitiesRating = await profilDatamapper.ratings.getAllActivities(userId);

      const avgRating = await profilDatamapper.ratings.getAvg(userId);

      res.status(200).json({
        data: userActivitiesRating,
        avgRating: avgRating.avg 
      });
    },

    async store(req, res) {
      const userId = req.session.userId;

    }
  }


};

export default profilController;