module.exports = (req,res,next) => {
    if(!req.session.isResetIn)
    {
       return res.redirect('/login');
    }
    next();
}