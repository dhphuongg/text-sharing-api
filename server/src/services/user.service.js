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

const getFullById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};

const getById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      avatar: true,
      fullName: true,
      username: true,
      birthday: true,
      bio: true,
      _count: { select: { followers: true } },
    },
  });
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
  getFullById,
  getById,
  getByEmail,
  updatePasswordById,
  updateById,
};
