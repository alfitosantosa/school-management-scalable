# Hapus image lama
docker rmi school-management:latest --force

# Build ulang dengan optimasi
docker compose build --no-cache

# Jalankan
docker compose up -d

# Hapus semua yang tidak terpakai
docker system prune -af --volumes --force

# Khusus cleanup build cache
docker builder prune --all --force

# Cleanup containerd
ctr -n moby images prune --force

# Cek ukuran image
docker images

# Cek disk usage docker
docker system df -v

# Cek ukuran containerd
du -sh /var/lib/containerd/io.containerd.snapshotter.v1.overlayfs