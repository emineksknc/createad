# Stage 1: React Uygulamasını Oluştur
FROM node:21 as react-builder

WORKDIR /app

COPY ./frontend/package.json  ./app/frontend

RUN npm install

COPY ./frontend ./app/frontend

RUN npm run build

# Stage 2: FastAPI Sunucusunu Oluştur
FROM continuumio/miniconda3

WORKDIR /app

# Conda ortamını oluşturun



