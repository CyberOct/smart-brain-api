

const handleRegister = (req, res, db,bcrypt) => {
    const { email, name, password } = req.body;
    //* Validating the users information inserted
    if(!email || !name || ! password) {
        return res.status(400).json('Incorrect form submission');
    }

    //* How bcrypt should look 
    /* bcrypt.hash(password, null, null, function (err, hash) {
        //* Store hash in the password DB
        console.log(hash);
    }); */
    //! Working without a DB 
    /*  database.users.push({ 
         id: '125',
         name: name,
         email: email,
         entries: 0,
         joined: new Date()
     }) */
    //* Working with a DB
    const hash = bcrypt.hashSync(password); //* using sychronous way
    //*Creatinga transaction in order to have consistency in DB tables. Transactions are used when you have to do more than 2 things at once.
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('You are already registered! If you lost your account please contact us to help! '));

}

module.exports = {
    handleRegister: handleRegister
};