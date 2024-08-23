const catchHandlerController = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default catchHandlerController;
