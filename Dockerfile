#use armv7hf compatible base image
FROM balenalib/armv7hf-debian:stretch

#dynamic build arguments coming from the /hooks/build file
ARG BUILD_DATE
ARG VCS_REF

#metadata labels
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-url="https://github.com/HilscherAutomation/netPI-nodered-npix-ai" \
      org.label-schema.vcs-ref=$VCS_REF

#enable building ARM container on x86 machinery on the web (comment out next line if built on Raspberry) 
RUN [ "cross-build-start" ]

#version
ENV HILSCHERNETPI_NODERED_NPIX_AI_VERSION 1.0.2

#labeling
LABEL maintainer="netpi@hilscher.com" \ 
      version=$HILSCHERNETPI_NODERED_NPIX_AI_VERSION \
      description="Node-RED with analog input node for NIOT-E-NPIX-4AI16U extension module"

#copy files
COPY "./init.d/*" /etc/init.d/ 
COPY "./node-red-contrib-npix-ai/*" /tmp/

#do installation
RUN apt-get update  \
    && apt-get install curl build-essential python-dev \
#install node.js
    && curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -  \
    && apt-get install -y nodejs  \
#install Node-RED
    && npm install -g --unsafe-perm node-red \
#install node
    && mkdir /usr/lib/node_modules/node-red-contrib-npix-ai \
    && mv /tmp/npixai.js /tmp/npixai.html /tmp/package.json -t /usr/lib/node_modules/node-red-contrib-npix-ai \
    && cd /usr/lib/node_modules/node-red-contrib-npix-ai \
    && npm install \
#clean up
    && rm -rf /tmp/* \
    && apt-get remove curl \
    && apt-get -yqq autoremove \
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/*

#set the entrypoint
ENTRYPOINT ["/etc/init.d/entrypoint.sh"]

#Node-RED Port
EXPOSE 1880

#set STOPSGINAL
STOPSIGNAL SIGTERM

#stop processing ARM emulation (comment out next line if built on Raspberry)
RUN [ "cross-build-end" ]