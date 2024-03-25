const prisma = require("../prisma-client");

const createMany = async (postId, mediaFileUrls = []) => {
  const postMedia = await prisma.postMedia.createMany({
    skipDuplicates: true,
    data: mediaFileUrls.map((url) => ({ postId, mediaFileUrl: url })),
  });
  return postMedia;
};

module.exports = { createMany };
