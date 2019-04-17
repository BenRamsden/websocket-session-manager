### websocket-session-manager

This software is a demo of WebSocket being used to manage the number of concurrent connections allowed by a single user.

There are 3 components to the software:
- Database - Powered by NeDB maintains a list of authenticated users, and their connections
- Server - Powered by express-ws, exposes a websocket API for the user to authenticate to
- Client - A simple User class that can connect and disconnect to the WebSocket backend. Each user can have multiple connections, and multiple users can be created very easily.

#### Scalability

WebSockets have previously been scaled to 600k idle connections on a M3.xlarge AWS server

https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/

Once the initial auth is complete, the purpose of the WebSocket is to determine when / if the user becomes disconnected; by declared means with the "BYE" event, or by loss of connectivity.

The main scaling challenge is the keepalive strategy for the web socket, this must be a lightweight stategy to ensure maximum scalability e.g. ping/pong every 30 minutes. But also frequent enough to ensure availability e.g. ensure users aren't DOSed due to loss of connection.

Because the solution relies on a large number of TCP connections. Dedicated high memory VMs should be used to run this solution, additional VMs should be automatically created when the existing machines reach their networking / memory limits.

E.g. if one server scales to 300k Web Sockets, 7 servers required to serve 2 million people.

To scale the database a managed service such as Azure CosmosDB should be subbed for the proof of concept NeDB.

#### Installation

- Install node (v8.11.4 tested) and npm (v5.6.0 tested)
- Run `npm install` to install dependencies
- Run `npm test` in the root folder to validate

#### Manually test the application

- Run `node server` in terminal 1
- Run `node client` in terminal 2 (notice connections = 1)
- Run `node client` in terminal 3 (notice connections = 2)
- Run `node client` in terminal 4 (notice connections = 3)
- Run `node client` in terminal 5 (notice connection is disallowed)

#### Authentication Flow

- Frontend connects to server
- Server sends
```$xslt
{
    type:"HELLO",
    payload: 'message from server'
}
```
- Client sends
```$xslt
{
    type: "AUTHENTICATE",
    payload: "my-unique-user-id"
}
```
- Server checks in database if user has >= 3 connections
- If the user does, server responds with
```$xslt
{
    type: "AUTHENTICATE_FAILURE",
    payload: "User has reached connection limit, no more connections allowed"
}
```
- Else server sets s.userId (authenticating the session)
- Server inserts / updates user document with connections += 1
- Server responds
```$xslt
{
    type:AUTHENTICATE_SUCCESS,
    payload: user
}
```
- Session is now authenticated

#### Disconnection Flow

- The frontend sends
```$xslt
{
    type: "BYE",
    payload: null
}
```
- The server checks if the user is authenticated, if so decrements the connection count
- The server responds
```$xslt
{ 
    type:BYE_SUCCESS, 
    payload:null 
}
```
- The server closes the connection