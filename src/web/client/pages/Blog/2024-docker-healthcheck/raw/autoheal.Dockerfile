FROM python:3-alpine

WORKDIR /app

COPY ./autoheal.py .

CMD [ "python3", "-u", "./autoheal.py" ]
