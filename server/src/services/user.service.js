const bcrypt = require("bcrypt");
const moment = require("moment");

const prisma = require("../prisma-client");
const { constants } = require("../constants");

const create = async ({ fullName, email, username, password }) => {
  const user = await prisma.user.create({
    data: { fullName, email, username, password },
  });
  return user;
};

const getById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};

const getByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const updatePasswordById = async (id, password) => {
  password = bcrypt.hashSync(password, constants.bcryptSalt);
  return await prisma.user.update({ where: { id }, data: { password } });
};

const updateById = async (id, data) => {
  if (data.birthday) data.birthday = new Date(data.birthday);
  return await prisma.user.update({ where: { id }, data });
};

module.exports = {
  create,
  getById,
  getByEmail,
  updatePasswordById,
  updateById,
};
