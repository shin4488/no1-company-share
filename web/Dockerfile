FROM ubuntu:26.04

RUN apt update
RUN apt install -y nginx
RUN apt install -y vim
RUN apt install -y sudo

CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]
