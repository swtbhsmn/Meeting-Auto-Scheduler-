const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports={
        query:{
          getPortfolioCompanys:async()=>{
                try {
                    return await prisma.portfolioCompany.findMany();
                  } catch (error) {
                    console.error(error);
                    return new Error('Error fetching users.');
                  }
            }
        }
}