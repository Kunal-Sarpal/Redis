const express = require('express');

const app = express();

const { createClient } = require('redis');

const User = require('./models/user');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: 14552
    }
});

client.on('connect', () => {
    console.log('Redis Client Connected');
});
client.connect();
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.post('/create', async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.create({
            name,
            email
        })
        res.status(200).send("User created successfully : " + user);

    }
    catch (err) {
        res.status(400).send(err);
    }
})
app.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let data = await client.get(`user:profile:${id}`);
        if (data) {
            console.log("Cache se data gya");
            return res.send(JSON.parse(data));
        }
        else {
            const user = await User.findOne({
                _id: id
            })
            // await client.set(`user:profile:${user._id}`, JSON.stringify(user));
            await client.setEx(`user:profile:${user._id}`,10, JSON.stringify(user));
            if (!user) {
                return res.status(404).send("User not found");
            }
            console.log("Databse se data gya");
            res.status(200).send("User  : " + user);
        }

    }
    catch (err) {
        res.status(400).send(err);
    }
})
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http:localhost:${port}`);
});
