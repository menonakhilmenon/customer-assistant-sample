#!/bin/bash
docker compose up -d
cd backend
npm install
cd ..
nodemon start backend/entrypoint.js