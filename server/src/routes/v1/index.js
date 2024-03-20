const router = require("express").Router();

const authRouter = require("./auth.route");

const defaultRouter = [
  {
    path: "/auth",
    router: authRouter,
  },
];

defaultRouter.forEach((r) => router.use(r.path, r.router));

module.exports = router;
