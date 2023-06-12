
exports.day=function(){
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date();
    return (today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
    
}