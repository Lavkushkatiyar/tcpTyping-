i have to create a agent that will send his cre

# file structure

```
|- src
|    |- serverPrototype
|    |- client.js
|- deno.json
|- gitignore
|- main.js
|- TODO.md
```

# task to do

```
[✅]1 .configure the Deno.json file.
[✅]2. create the client.js
[✅]3. create a connection in client.js 
[✅]4. test the connection with the prototype
[✅] 5. validate request structure
```

# request Data Structure

```js
"request": {
    "command": "CREATE",
    "data": {
      "userName": "someone",
      "password": "12345",
      "userId": "someone123"
    }
  }
```

# show the paragraph to the user

command : "FETCH_PARAGRAPH"

[] next step take the data and sends it to our app and starts typing []

# step to do now

implement the take input from the user ' we will take input from user and server
will send whole para to the app '

' we will take the whole paragraphs wrote by the user and then we will compute
the result and send it to sever' 'server must send it to the user '

- or display it there

# userSession Structure

```js
userSession = {
  userParagraph: "",
  userTypedWords: "",
  startTime,
};
```

we have to implement Deno.serve add consistency in the code by making response
consistent
