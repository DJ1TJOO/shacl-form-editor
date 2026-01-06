# Stage 1: Build the application
FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches

COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @shacl-form-editor/web build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

