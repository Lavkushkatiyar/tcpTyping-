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
3. create a connection in client.js 
4. test the connection with the prototype
5. validate request structure
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
