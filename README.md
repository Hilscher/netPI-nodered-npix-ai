## NPIX-4AI16U node

[![](https://images.microbadger.com/badges/image/hilschernetpi/netpi-nodered-npix-ai.svg)](https://microbadger.com/images/hilschernetpi/netpi-nodered-npix-ai "NPIX-4AI16U")
[![](https://images.microbadger.com/badges/commit/hilschernetpi/netpi-nodered-npix-ai.svg)](https://microbadger.com/images/hilschernetpi//netpi-nodered-npix-ai "NPIX-4AI16U")
[![Docker Registry](https://img.shields.io/docker/pulls/hilschernetpi/netpi-nodered-npix-ai.svg)](https://registry.hub.docker.com/u/hilschernetpi/netpi-nodered-npix-ai/)&nbsp;
[![Image last updated](https://img.shields.io/badge/dynamic/json.svg?url=https://api.microbadger.com/v1/images/hilschernetpi/netpi-nodered-npix-ai&label=Image%20last%20updated&query=$.LastUpdated&colorB=007ec6)](http://microbadger.com/images/hilschernetpi/netpi-nodered-npix-ai "Image last updated")&nbsp;

Made for [netPI](https://www.netiot.com/netpi/), the Raspberry Pi 3B Architecture based industrial suited Open Edge Connectivity Ecosystem

### Node-RED and analog input node for netPI's NIOT-E-NPIX-4AI16U extension module

The image provided hereunder deploys a container with installed Debian, Node-RED and analog input node to communicate with the extension module NIOT-E-NPIX-4AI16U. The package relies on the npm package [node-ads1x15](https://github.com/alphacharlie/node-ads1x15).

Base of this image builds the latest version of [debian:stretch](https://hub.docker.com/r/resin/armv7hf-debian/tags/) with installed Internet of Things flow-based programming web-tool [Node-RED](https://nodered.org/) and one extra node *ai in* providing access to the four isolated analog input signals of the NPIX module. 

The module features two [ADS1115 A/D converters](http://www.ti.com/lit/ds/symlink/ads1115.pdf) connecting to the I2C-1 bus at address 48hex and 49hex and providing the four diffential inputs measured between the modules' pins IN0...3 and V_GND. The maximum input voltage Umax may not exceed +/-32VDC.

ATTENTION! Never plug or unplug any extension module if netPI is powered. Make sure a module is already inserted before applying 24VDC to netPI. 

#### Container prerequisites

##### Port mapping

To allow the access to the Node-RED programming tool over a web browser the container TCP port `1880` needs to be exposed to the host.

##### Host device

To grant access to the ADS1115 converters from inside the container the `/dev/i2c-1` host device needs to be added to the container.

#### Getting started

STEP 1. Open netPI's website in your browser (https).

STEP 2. Click the Docker tile to open the [Portainer.io](http://portainer.io/) Docker management user interface.

STEP 3. Enter the following parameters under *Containers > + Add Container*


Parameter | Value | Remark
:---------|:------ |:------
*Image* | **hilschernetpi/netpi-nodered-npix-ai** |
*Port mapping* | *host* **1880** -> *container* **1880** | *host*=any unused
*Restart policy* | **always**
*Runtime > Devices > +add device* | *Host path* **/dev/i2c-1** -> *Container path* **/dev/i2c-1** |

STEP 4. Press the button *Actions > Start/Deploy container*

Pulling the image may take a while (5-10mins). Sometimes it may take too long and a time out is indicated. In this case repeat STEP 4.

#### Accessing

The container starts Node-RED automatically when started.

Open Node-RED in your browser with `http://<netPi ip address>:<mapped host port>` (NOT https://) e.g. `http://192.168.0.1:1880`.

One extra node named *ai in* in the nodes *npix* library provides you access to the four analog inputs of the NPIX module. The node's info tab in Node-RED explains how to use it.

#### Automated build

The project complies with the scripting based [Dockerfile](https://docs.docker.com/engine/reference/builder/) method to build the image output file. Using this method is a precondition for an [automated](https://docs.docker.com/docker-hub/builds/) web based build process on DockerHub platform.

DockerHub web platform is x86 CPU based, but an ARM CPU coded output file is needed for Raspberry systems. This is why the Dockerfile includes the [balena.io](https://balena.io/blog/building-arm-containers-on-any-x86-machine-even-dockerhub/) steps.

#### License

View the license information for the software in the project. As with all Docker images, these likely also contain other software which may be under other licenses (such as Bash, etc from the base distribution, along with any direct or indirect dependencies of the primary software being contained).
As for any pre-built image usage, it is the image user's responsibility to ensure that any use of this image complies with any relevant licenses for all software contained within.

[![N|Solid](http://www.hilscher.com/fileadmin/templates/doctima_2013/resources/Images/logo_hilscher.png)](http://www.hilscher.com)  Hilscher Gesellschaft fuer Systemautomation mbH  www.hilscher.com

