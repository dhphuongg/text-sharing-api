const bcrypt = require('bcrypt');

const prisma = require('../prisma-client');
const { constants } = require('../constants');

const create = async ({ fullName, email, username, password }) => {
  const user = await prisma.user.create({
    data: { fullName, email, username, password },
    select: {
      id: true,
      avatar: true,
      fullName: true,
      username: true,
      birthday: true,
      bio: true,
      _count: { select: { followers: true } }
    }
  });
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
      _count: { select: { followers: true } }
    }
  });
  return user;
};

const getByEmail = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

const updatePasswordById = async (id, password) => {
  password = bcrypt.hashSync(password, constants.bcryptSalt);
  const user = await prisma.user.update({
    where: { id },
    data: { password },
    select: {
      id: true,
      avatar: true,
      fullName: true,
      username: true,
      birthday: true,
      bio: true,
      _count: { select: { followers: true } }
    }
  });
  return user;
};

const updateById = async (id, data) => {
  if (data.birthday) data.birthday = new Date(data.birthday);
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      avatar: true,
      fullName: true,
      username: true,
      birthday: true,
      bio: true,
      _count: { select: { followers: true } }
    }
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
      select: {
        id: true,
        avatar: true,
        fullName: true,
        username: true,
        birthday: true,
        bio: true,
        _count: { select: { followers: true } }
      },
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
  getById,
  getByEmail,
  updatePasswordById,
  updateById,
  search
};
