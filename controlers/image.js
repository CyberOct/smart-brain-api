 const Clarifai = require('clarifai'); //!-> old way of importing 
//* New way of importing :
//import Clarifai from 'clarifai';
const app = new Clarifai.App({
    apiKey: 'ef86ab852d9c4d5e8591543204c35bd4'
});

const handleApiCall = (req,res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res,db) => {
    const { id } = req.body;
    //! Working without a DB 
    /*  let found = false;
     database.users.forEach(user => {
         if (user.id === id) {
             found = true;
             user.entries ++;
             return res.json(user.entries);
         }
     })
     if (!found) {
         res.status(400).json('not found');
     } */

    //* Working with a DB
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}