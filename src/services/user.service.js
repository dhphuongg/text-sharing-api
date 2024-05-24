const bcrypt = require('bcrypt');

const prisma = require('../prisma-client');
const { constants } = require('../constants');

const selectUser = {
  id: true,
  avatar: true,
  fullName: true,
  username: true,
  birthday: true,
  bio: true,
  _count: { select: { followers: true, following: true } }
};

const create = async ({ fullName, email, username, password }) => {
  const user = await prisma.user.create({
    data: { fullName, email, username, password },
    select: selectUser
  });
  return user;
};

const getFullById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};

const getById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: selectUser
  });
  return user;
};

const getByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: selectUser
  });
  return user;
};

const getByUsernameOrEmail = async (username) => {
  const user = await prisma.user.findFirst({ where: { OR: [{ email: username }, { username }] } });
  return user;
};

const updatePasswordById = async (id, password) => {
  password = bcrypt.hashSync(password, constants.bcryptSalt);
  const user = await prisma.user.update({
    where: { id },
    data: { password },
    select: selectUser
  });
  return user;
};

const updateById = async (id, data) => {
  if (data.birthday) data.birthday = new Date(data.birthday);
  const user = await prisma.user.update({
    where: { id },
    data,
    select: selectUser
  });
  return user;
};

const search = async ({ keyword, limit, page }) => {
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where: {
        OR: [
          { username: { search: keyword } },
          { username: { contains: keyword } },
          { fullName: { search: keyword } },
          { fullName: { contains: keyword } }
        ]
      },
      select: selectUser,
      take: limit,
      skip: (page - 1) * limit
    }),
    prisma.user.count({
      where: {
        OR: [
          { username: { search: keyword } },
          { username: { contains: keyword } },
          { fullName: { search: keyword } },
          { fullName: { contains: keyword } }
        ]
      }
    })
  ]);
  return { users, total };
};

module.exports = {
  create,
  getFullById,
  getByUsername,
  getById,
  getByUsernameOrEmail,
  updatePasswordById,
  updateById,
  search
};
