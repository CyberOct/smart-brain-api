const handleProfileGet = (req, res,db) => {
    const { id } = req.params;
    //! Working without a DB 
    /*  database.users.forEach(user => {
         if (user.id === id ) {
             return res.json(user);
             found = true;
         }
     }) */
    //* Working with a DB
    db.select('*').from('users')
        .where({
            id: id
        })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found! ');
            }

        })
        .catch(err => res.status(400).json('Error getting user!'));
}

module.exports = {
    handleProfileGet
}