#!/bin/bash

echo "=== FORCE REMOVE IMAGE OLD ==="
docker rmi school-management:latest --force || true

echo "=== REMOVE ALL STOPPED CONTAINERS ==="
docker rm -f $(docker ps -aq) 2>/dev/null || true

echo "=== REMOVE ALL IMAGES FORCE ==="
docker rmi -f $(docker images -aq) 2>/dev/null || true

echo "=== REMOVE ALL VOLUMES ==="
docker volume rm $(docker volume ls -q) 2>/dev/null || true

echo "=== PRUNE ALL SYSTEM (FULL) ==="
docker system prune -af --volumes

echo "=== PRUNE DOCKER BUILDER CACHE ==="
docker builder prune --all --force

echo "=== CLEANUP CONTAINERD PRUNE ==="
ctr -n moby images prune --force || true

echo "=== CLEANUP CONTAINERD SNAPSHOTS (MANUAL WARNING) ==="
# HATI-HATI: Ini hanya untuk deep clean — uncomment jika benar-benar perlu
# rm -rf /var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/*

echo "=== REBUILD DOCKER COMPOSE (NO CACHE) ==="
docker compose build --no-cache

echo "=== START PROJECT ==="
docker compose up -d

echo "=== DOCKER IMAGES ==="
docker images

echo "=== DISK USAGE DOCKER ==="
docker system df -v

echo "=== DISK USAGE CONTAINERD SNAPSHOTS ==="
du -sh /var/lib/containerd/io.containerd.snapshotter.v1.overlayfs || true

echo "=== DONE : CLEAN & REBUILD COMPLETED ==="