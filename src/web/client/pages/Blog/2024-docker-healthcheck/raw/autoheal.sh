docker run \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    --log-driver local \
    --restart=always \
    --detach \
    --name autoheal \
    autoheal
