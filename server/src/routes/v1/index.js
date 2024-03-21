const router = require("express").Router();

const { constants } = require("../../constants");
const auth = require("../../middlewares/auth");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");

const defaultRouter = [{ path: "/auth", router: authRouter }];

const protectRouter = [{ path: "/user", router: userRouter }];

defaultRouter.forEach((r) => router.use(r.path, r.router));

protectRouter.forEach((r) =>
  router.use(r.path, auth([constants.role.user]), r.router)
);

module.exports = router;
