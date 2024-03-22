const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const { constants } = require("../src/constants");
const { userMocks, otpMocks } = require("./mocks");

const prisma = new PrismaClient();

async function main() {
  await prisma.otp.createMany({
    data: otpMocks,
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: userMocks.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, constants.bcryptSalt),
    })),
  });
}

main()
  .then(async () => {
    console.log("Seeding database successfull!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
