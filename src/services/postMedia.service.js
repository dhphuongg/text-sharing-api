const prisma = require('../prisma-client');

const createMany = async (postId, media = []) => {
  const postMedia = await prisma.postMedia.createMany({
    skipDuplicates: true,
    data: media.map(({ url, type }) => ({ postId, url, type }))
  });
  return postMedia;
};

module.exports = { createMany };
