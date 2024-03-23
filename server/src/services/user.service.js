const bcrypt = require("bcrypt");

const prisma = require("../prisma-client");
const { constants } = require("../constants");

const create = async ({ fullName, email, username, password }) => {
  const user = await prisma.user.create({
    data: { fullName, email, username, password },
  });
  user && delete user.password;
  return user;
};

const getById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { followers: true },
  });
  user && delete user.password;
  return user;
};

const getByEmail = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

const updatePasswordById = async (id, password) => {
  password = bcrypt.hashSync(password, constants.bcryptSalt);
  const user = await prisma.user.update({ where: { id }, data: { password } });
  user && delete user.password;
  return user;
};

const updateById = async (id, data) => {
  if (data.birthday) data.birthday = new Date(data.birthday);
  const user = await prisma.user.update({ where: { id }, data });
  user && delete user.password;
  return user;
};

module.exports = {
  create,
  getById,
  getByEmail,
  updatePasswordById,
  updateById,
};
