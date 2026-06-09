FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3001

# ← Bắt buộc chỉ định port 3001, Next.js mặc định 3000
CMD ["npm", "run", "dev", "--", "-p", "3001"]
