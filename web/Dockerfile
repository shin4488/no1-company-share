FROM ubuntu:20.04

RUN apt update
RUN apt install -y nginx
RUN apt install -y vim
RUN apt install sudo

CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]