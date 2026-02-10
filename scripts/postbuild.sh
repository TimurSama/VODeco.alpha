#!/bin/bash
# Post-build script for Vercel
# Runs migrations after build if DATABASE_URL is available

if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
else
  echo "DATABASE_URL not set, skipping migrations"
  echo "Migrations will be run on first API request or manually"
fi
