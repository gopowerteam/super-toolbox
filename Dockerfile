# STEP1: 构建基础镜像
FROM alpine:3.20 as base
# -设置环境变量
ENV NODE_VERSION=20.13.0
ENV PNPM_VERSION=9.5.0
ENV APP_PATH=/app

ARG GATEWAY
ENV VITE_HTTP_GATEWAY=${GATEWAY}
# -设置工作目录
WORKDIR $APP_PATH
# 安装基础包
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk add --no-cache nodejs npm python3 curl gcc g++ make linux-headers \
    && npm install -g pnpm@$PNPM_VERSION --registry=https://registry.npmmirror.com \
    && node --version \
    && pnpm --version



# STEP2: 构建依赖镜像
FROM base as install
# -复制依赖相关目录
COPY package.json pnpm-lock.yaml .npmrc ./
# -安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# STEP3: 构建运行镜像
FROM base as build
# -复制依赖文件
COPY --from=install $APP_PATH/node_modules ./node_modules
# -复制代码文件
COPY . .
# -运行编译
RUN pnpm run build:h5

# STEP4: 运行Nginx服务
FROM nginx:stable

RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/nginx.conf

COPY --from=build /app/dist/build/h5/ /usr/share/nginx/html/
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
