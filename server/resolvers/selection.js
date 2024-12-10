const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = {
  query: {
    getSelections: async () => {
      const selections = await prisma.selection.findMany({
        include: {
          investor: {
            select: {
              name: true,
              company: true,
              timezone: true,
              availability: {
                select: {
                  date: true,
                  startTime: true,
                  endTime: true,
                }
              },
            },
          },
          portfolio: {
            select: {
              name: true,
              company: true,
              timezone: true,
              availability: {
                select: {
                  date: true,
                  startTime: true,
                  endTime: true,
                }
              }

            },
          },
        },
      });
      return selections
    }
  }
}
