const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

module.exports = {
  query: {
    
  },
  mutation: {
    login:async ({ username, password }) => {
      try {
        const user = await prisma.user.findUnique({where:{email:username}});
        if (!user) {
          return new Error('Invalid username or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return new Error('Invalid username or password');
        }
        const tokenPayload = {
          id: user.id,
          username: user.username,
          role: user.role,
          firstName:user.firstName,
          lastName:user.lastName,
          email:user.email
        };
        const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
        return {
          message: 'Login successful',
          token
        };
      } catch (error) {
        console.error('Login error:', error);
        return new Error(`Login failed: ${error.message}`);
      }
    }
  }
};