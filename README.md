## Incognito Peer to Peer WebRTC encrypted video chat conferencing

Encrypted WebRTC video conferencing app built on Javascript.  Uses peer-to-peer connections for A/V and a centeralized sockets.IO signaling server for command delegation.  Bypasses firewalls and is obfuscation routing network safe (TOR).

![Screenshot](screenshot.png)

## Challenge and Approach

Our approach for satisfying this challenge for the AT&T Mobile App Hackathon​ in 2015 was to:

- Utilize Javascript and P2P web conferencing with an encrypted network layer.
- Video and audio conferencing utilizes Google's VP8 WebP compression and Opus Audio Codec.
- Signaling (muting audio and disabling webcam) and chat uses JSON over communicated over HTTPS websockets

## Lead developer

- [@loudest](https://github.com/loudest)

## Technologies, APIs, and Datasets Utilized

We made use of:
- [JavaScript] - WebRTC, Sockets.IO, JSON communication key encryption over AES

## Microservice REST API explained
sockets.io listens to the following service REST endpoints:
1. /create - Join the conference room and assigns a room UUID 
2. /message - P2P message routing and broadcast to all clients connected to the specific room UUID
3. /connection - signal connection setting for a specific UUID
4. /connection/shareScreen - notify the party leader that a request to share the screen is initated
5. /connection/unshareScreen - notify the party leader that a request to unshare the screen is initated 
6. /join - Party joins a room as specified from client after the GET param
7. /disconnect - Disconnect the client from a room shut off all connections to the peer
8. /leave - Leaves the conference room

## How to run

1) You first need to have node.JS installed
2) Next run npm install to download the appropriate Javascript dependencies
3) Run the server by: node server.js
4) You will have a URL generated for example: https://localhost:50000/

Go to https://localhost:50000 and you will have an instant P2P encrypted video conferencing app

Your peers will connect via an unique room key generated from the url: https://localhost:50000/?4wuluugvjhhaudgtrzhcnxw29

Once they join, you can have muti-party conferencing.  Currently up to 4 people are only supported.  Chat interface does not poll since no stateful logging is done client side.

Our code is licensed under the [MIT License](LICENSE.md).
