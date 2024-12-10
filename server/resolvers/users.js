const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
module.exports = {
  query: {
    users: async () => {
      try {
        return await prisma.user.findMany();
      } catch (error) {
        console.error(error);
        return new Error('Error fetching users.');
      }
    },
    user: async ({ id }) => {
      try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return new Error('User not found.');
        return user;
      } catch (error) {
        console.error(error);
        return new Error('Error fetching the user.');
      }
    }
  },
  mutation: {
    createUser: async ({ firstName, lastName, email, password , role}) => {
      try {
        const isUserExists = await prisma.user.findUnique({ where: { email: email } })
        if (isUserExists) {
          const error = new Error(`A user with the email "${email}" already exists.`);
          error.extensions = {
            code: "USER_ALREADY_EXISTS",
            httpStatus: 409,
          };
          return error;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return await prisma.user.create({data: { firstName, lastName, email, password:hashedPassword, role }});
      } catch (error) {
        console.error(error);
        return new Error('Error creating the user.');
      }
    },
    updateUser: async ({ id, firstName, lastName, email, password, role }) => {
      try {
        return await prisma.user.update({
          where: { id },
          data: { firstName, lastName, email, password, role },
        });
      } catch (error) {
        console.error(error);
        return new Error('Error updating the user.');
      }
    },
    deleteUser: async ({ id }) => {
      try {
        return await prisma.user.delete({ where: { id } });
      } catch (error) {
        console.error(error);
        return new Error('Error deleting the user.');
      }
    }
  }
};