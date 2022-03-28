//Session
req.session.id=user.id

when ever we set the user session that value is sent to redis

1. {user.Id:1} -> sent to redis

//when we require the session value we the send the session data and redis provide the required data
sess:djalfjhlhfldajskj ->{user.Id:1}

2. //Session middleware(express-session) will set the cookie on the browser and the cookie value is the signed version of the session key
   qskldhfhklh

3. when user makes a request qskldhfhklh-> sent to the server

4. The server unsigns the qskldhfhklh->sess:djalfjhlhfldajskj using the secret that is sent

5. make a request to redis sess:djalfjhlhfldajskj-> {userId:1}
