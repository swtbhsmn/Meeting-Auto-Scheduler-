const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = {
  query: {
    async getTotalCounts() {
        try {
            // Define the table metadata
            const tables = [
              { model: prisma.user, title: 'Users' },
              { model: prisma.investor, title: 'Investors' },
              { model: prisma.portfolioCompany, title: 'Portfolio Companies' },
              { model: prisma.selection, title: 'Selections' },
              { model: prisma.meeting, title: 'Meetings' },
              { model: prisma.availabilitySlot, title: 'Availability Slots' },
              { model: prisma.event, title: 'Events' },
            ];
    
            // Loop through the tables and get counts
            const results = await Promise.all(
              tables.map(async ({ model, title }) => {
                const count = await model.count();
                return {
                  title,
                  value: count.toString(),
                  interval: '',
                  trend: count > 0 ? 'up' : 'down',

                };
              })
            );
    
            return results;
          } catch (error) {
            console.error("Error fetching counts:", error);
            return new Error("Failed to fetch total counts.");
          }
        },
  }
};