FROM node:14.15.4-buster
WORKDIR /usr/local/app
COPY . .
COPY package*.json ./
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
RUN sed -i 's/deb.debian.org/mirrors.163.com/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.163.com/g' /etc/apt/sources.list
RUN apt-get update --fix-missing -o Acquire::http::No-Cache=True \
    && apt-get install -y autoconf automake g++ libtool git libsodium-dev python python-dev gcc make
RUN npm install --registry=http://registry.npm.taobao.org/
EXPOSE 3000
CMD npm run start