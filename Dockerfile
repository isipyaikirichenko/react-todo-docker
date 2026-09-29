# ---------- Этап 1: сборка статики ----------
FROM node:alpine AS build
WORKDIR /app

# Сначала копируем только манифесты — слой с зависимостями кэшируется
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходники и собираем production-сборку
COPY . .
# Заголовок приложения можно передать при сборке: --build-arg REACT_APP_TITLE="..."
ARG REACT_APP_TITLE="Список задач"
ENV REACT_APP_TITLE=$REACT_APP_TITLE
RUN npm run build

# ---------- Этап 2: production на nginx ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
