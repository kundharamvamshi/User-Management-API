const express = require('express');
const {v4 : uuidv4} = require('uuid');

const app = express();

const PORT = 3000;


app.use(express.json());

let users = [];

app.get('/users', (req, res) => {
  const {search,sort,order} = req.query;

  if (search) {
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
    return res.json(filteredUsers);
  }
  if (sort) {
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return b.name.localeCompare(a.name);
      }
      return a.name.localeCompare(b.name);
    });
    return res.json(sortedUsers);
  }
  return res.json(users);
});


app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(eachUser => eachUser.id === id);
    if (user===undefined) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
});


app.post('/users',(req,res)=>{
    const {username,email} = req.body;
    if (username === undefined || email === undefined) {
        return res.status(400).json({ error: 'username or email cannot be empty' });
    }   
    const newUser = {
        id: uuidv4(),
        name: username,
        email: email
    };
    users=[...users,newUser];
    return res.status(201).json('User created successfully');

});

app.put('/users/:id',(req,res)=>{
    const { id } = req.params;
    const {username,email} = req.body;
    const existingUser = users.find(eachUser => eachUser.id === id);

    if (existingUser === undefined) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
        ...existingUser,
        name: username,
        email: email 
    };
    users = users.map(eachUser=>{
        if (eachUser.id === id) {
            return updatedUser;
        }
        else {  
            return eachUser
        };
    });
    return res.json('User details updated successfully');
}); 

app.delete('/users/:id',(req,res)=>{
    const { id } = req.params;
    const existingUser = users.find(eachUser => eachUser.id === id);

    if (existingUser === undefined) {
        return res.status(404).json({ error: 'User not found' });
    }

    users = users.filter(eachUser => eachUser.id !== id);
    return res.json('User deleted successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = app;