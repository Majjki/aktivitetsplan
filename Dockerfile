FROM docker.pkg.github.com/navikt/pus-decorator/pus-decorator

# medfører 2 ting i pus-decorator:
#  - /environment.js-endepunktet legger public properties på window.aktivitetsplan
#  - applikasjonen får /aktivitetsplan som contextpath i begge soner
ENV APPLICATION_NAME=aktivitetsplan
ENV GZIP_ENABLED=true
ENV EXTRA_DECORATOR_PARAMS='&footer_type=without_alpabeth'

COPY /build /app

ADD decorator.yaml /decorator.yaml
ADD decorator-fss.yaml /decorator-fss.yaml
