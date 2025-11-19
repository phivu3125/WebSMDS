FROM node:20-alpine

WORKDIR /usr/src/app
COPY package.json ./

RUN yarn global add typescript
RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN yarn build

EXPOSE 5001
EXPOSE 5000
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

# docker build -t server .
# docker run -p 3000:3000 server.