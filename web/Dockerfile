FROM ubuntu

# Ubuntu系であるためapt-getを使用
RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y vim
RUN apt install sudo

CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]