#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "================================================"
echo " Pushing Hotel Management System to GitHub"
echo " Repo: https://github.com/Tamil5710/hotel_management_system.git"
echo "================================================"
echo ""

# Ensure git remote is set
git remote set-url origin https://github.com/Tamil5710/hotel_management_system.git

echo "Executing: git push -u origin main"
echo "If prompted for Password, use your GitHub Personal Access Token (PAT)."
echo ""

git push -u origin main
