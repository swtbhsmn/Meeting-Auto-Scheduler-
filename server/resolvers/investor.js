const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports={
        query:{
            getInvestors:async()=>{
                try {
                    return await prisma.investor.findMany();
                  } catch (error) {
                    console.error(error);
                    return new Error('Error fetching users.');
                  }
            }
        }
}