### websocket-session-manager

This software is a demo of WebSocket being used to manage the number of concurrent connections allowed by a single user.

There are 3 components to the software:
- Database - Powered by NeDB maintains a list of authenticated users, and their connections
- Server - Powered by express-ws, exposes a websocket API for the user to authenticate to
- Client - A simple User class that can connect and disconnect to the WebSocket backend. Each user can have multiple connections, and multiple users can be created very easily.

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