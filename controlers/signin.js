const handleSignin = (req, res, db, bcrypt) => {
    //res.json('sign in'); //* respond with .json insdeat of .send , because of some added features on express using .json

    //* How bcrypt should look 
    /* bcrypt.compare("apples", '$2a$10$DsVfx8aU6OPcMGsVJ5uOA.HqNZrCs8L6ZR3GkUnq3vODETin9EJDa', function (err, res) {
        console.log('first-guess' ,res );
    });
    bcrypt.compare("veggies", '$2a$10$DsVfx8aU6OPcMGsVJ5uOA.HqNZrCs8L6ZR3GkUnq3vODETin9EJDa', function (err, res) {
        console.log('secind-guess', res);
    }); */

    //! Working without a DB 
    /* if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error loggin in');
    } */

    //* Working with a DB
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users').where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin: handleSignin
};