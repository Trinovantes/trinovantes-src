import socket
import http.client
import json
import time
import datetime
from datetime import timezone


DOCKER_SOCKET = '/var/run/docker.sock'
SLEEP_TIME = 30 # sec


def req_docker(method: str, api_path: str):
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
        sock.connect(DOCKER_SOCKET)
        connection = http.client.HTTPConnection('localhost')
        connection.sock = sock
        connection.request(method, api_path)

        res = connection.getresponse()
        if method == 'GET':
            res_data = json.loads(res.read())
        else:
            res_data = None

        if not (res.status >= 200 and res.status < 300):
            raise Exception(f'Docker request failed ({res.status}):\n\n{res_data}')

        return res_data


def get_containers():
    filters = json.dumps({
        'status': ['running'],
        'health': ['unhealthy']
    }, separators=(',', ':'))
    url = f'/containers/json?filters={filters}'
    return req_docker('GET', url)


def restart_container(container_short_id: str):
    url = f'/containers/{container_short_id}/restart'
    return req_docker('POST', url)


def check_and_restart_unhealthy_containers():
    now = datetime.datetime.now(timezone.utc).isoformat()
    containers = get_containers()
    if len(containers) == 0:
        print(f'[{now}] All containers healthy')
    else:
        print(f'[{now}] Found {len(containers)} unhealthy container(s)')

    for container in containers:
        container_name = container['Name'] if 'Name' in container else container['Names'][0]
        container_short_id = container['Id'][0:12]
        print(f'[{now}] Restarting {container_name} ({container_short_id})')
        restart_container(container_short_id)


if __name__ == '__main__':
    while True:
        check_and_restart_unhealthy_containers()
        time.sleep(SLEEP_TIME)
