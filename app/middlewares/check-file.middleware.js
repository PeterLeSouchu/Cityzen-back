// import { fileTypeFromFile } from 'file-type';
// import path from 'node:path';
// import ApiError from '../errors/api.error.js';
// import errors from '../errors/errors.js';

// const { fileError, internalServerError } = errors;

// async function checkFile(req, res, next) {
//   if (req.file) {
//     try {
//       // To handle the patch case because a pathc dont contains an image everytime
//       const filePath = path.join(
//         import.meta.dirname,
//         '../../public/images',
//         req.session.imageName
//       );
//       const fileExtension = await fileTypeFromFile(filePath);

//       if (!process.env.ALLOWED_EXTENSION_FILES.includes(fileExtension.ext)) {
//         next(
//           new ApiError(fileError.details, fileError.message.notAllowed, null)
//         );
//         return;
//       }
//     } catch (error) {
//       throw new ApiError(
//         internalServerError.details,
//         internalServerError.message.global,
//         error
//       );
//     }
//   }
//   next();
// }

// export default checkFile;

import cloudinary from '../config/cloudinary-config.js';

export const cloudinaryMiddleware = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  cloudinary.uploader
    .upload_stream((error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Erreur lors de l'upload sur Cloudinary" });
      }
      req.urlImage = result.secure_url;
      req.imageId = result.public_id;

      return next();
    })
    .end(req.file.buffer);
};
