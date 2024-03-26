const prisma = require("../prisma-client");

const create = async (userId, postId) => {
  const reaction = await prisma.reation.create({
    data: { userId, postId },
  });
  return reaction;
};

const deleteById = async (userId, postId) => {
  const reaction = await prisma.reation.delete({
    where: { postId_userId: { postId, userId } },
  });
  return reaction;
};

module.exports = { create, deleteById };
