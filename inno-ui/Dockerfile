FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_AUTH_API_URL=http://localhost:5119
ARG VITE_PROFILES_API_URL=http://localhost:5082
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_PROFILES_API_URL=$VITE_PROFILES_API_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
