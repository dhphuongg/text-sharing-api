const prisma = require("../prisma-client");

const create = async (postId, mediaFileUrls = []) => {
  const postMedia = await prisma.postMedia.createMany({
    skipDuplicates: true,
    data: mediaFileUrls.map((url) => ({ postId, mediaFileUrl: url })),
  });
};

module.exports = { create };
