FROM node:18-alpine as build

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Add build arguments for production variables
ARG VITE_GHOST_URL
ARG VITE_GHOST_CONTENT_KEY
ARG VITE_MONERO_ADDRESS
ARG VITE_YOUTUBE_URL
ARG VITE_TWITTER_URL
ARG VITE_DISCORD_URL
ARG VITE_TWITCH_URL

# Set them as environment variables so Vite can bake them in
ENV VITE_GHOST_URL=$VITE_GHOST_URL
ENV VITE_GHOST_CONTENT_KEY=$VITE_GHOST_CONTENT_KEY
ENV VITE_MONERO_ADDRESS=$VITE_MONERO_ADDRESS
ENV VITE_YOUTUBE_URL=$VITE_YOUTUBE_URL
ENV VITE_TWITTER_URL=$VITE_TWITTER_URL
ENV VITE_DISCORD_URL=$VITE_DISCORD_URL
ENV VITE_TWITCH_URL=$VITE_TWITCH_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
