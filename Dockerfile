FROM node:17
WORKDIR /ona-app
COPY package.json .
RUN npm install
COPY . ./
ENV PORT 3030
ENV MONGODB_URI mongodb://127.0.0.1:27017/ona-archives
EXPOSE 3030
CMD ["npm", "run", "dev"]





