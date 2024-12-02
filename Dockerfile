FROM node:lts-alpine3.19 as nodeBuild

WORKDIR app
COPY assets .
RUN npm ci && npm run prod

FROM python:3.12.3-alpine3.19

WORKDIR app

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install waitress
COPY penne ./penne
RUN mkdir -p ./penne/static/dist
COPY --from=nodeBuild /penne/static/dist ./penne/static/dist

EXPOSE 5000
CMD [ "waitress-serve", "--listen", "0.0.0.0:5000", "--call", "penne:create_app" ]
