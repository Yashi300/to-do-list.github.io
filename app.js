const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require('mongoose');
const date=require(__dirname+"/date.js");
const _ = require('lodash');
// console.log(date);
mongoose.connect('mongodb+srv://Yashi_7103:Yashi123@cluster0.rt2ewjo.mongodb.net/todolist');
const PORT=process.env.PORT || 3000;

const itemSchema=new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const Item = mongoose.model('item', itemSchema);

const listSchema=new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contains:[itemSchema]
});
const List = mongoose.model('list', listSchema);




const item1= new Item(
  { name: 'Welcome to your to-do-list' }
  );
const item2= new Item(
  { name: 'Hit + to add an item' }
  );
const item3= new Item(
  { name: '<-- Hit this to delete an item' }
  );
// Item.insertMany([item1, item2, item3]).then(() => console.log('meow'));




const app=express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// const listItem=[];
// async function myfruits() {
//   // mongoose.connect.close();
//   const Items= await Item.find({});
//   Items.forEach(function(items){
//       console.log(items);
//       listItem.push(items.name);
//     });
//   }
  // const Worklist=[];
  
  app.get("/", (req, res)=>{
    const day=date.day();
    async function myfruits() {
      // mongoose.connect.close();
      const Items= await Item.find({});
      // console.log(Items.length);
      if(Items.length===0){
       Item.insertMany([item1, item2, item3]).then(() => console.log('meow'));
       res.redirect("/");
      }else{

        Items.forEach(function(itoms){
            // console.log(itoms);
            // listItem.push(items.name);
          });
          res.render('list', { kindofday: day, listWork: Items });
        }
      }
      myfruits();
});

app.post("/delete", (req, res)=>{
  console.log(req.body);
  const day=date.day();
  console.log(day);
  if((req.body.Listname===day)){
    const namee=req.body.check;
    async function del(){
      await Item.deleteOne({ name: namee });
      res.redirect("/");
    }
    del();
  }else{
    const namee=req.body.check;
    async function del(){
      await List.updateOne({ name: req.body.Listname }, {
        $pull: {
            contains: {name: req.body.check},
        },
    });
    res.redirect(`/${req.body.Listname}`)
    }
    del()
  }
})

app.get("/:servicename", function(req, res){
  // res.send('The id you specified is ' + req.params.servicename);
  const servicename=_.capitalize(req.params.servicename);
  async function run(){
    const Check=await List.findOne({ name: servicename })
    if(!Check){
      const listitem=new List({
        name:servicename,
        contains:[item1, item2, item3]
      })
      listitem.save().then(() => console.log('meow'));
      res.redirect(`/${servicename}`)
    }else{
      res.render('list', { kindofday: servicename, listWork: Check.contains });
    }
  }
  run();
});

app.post("/",(req, res)=>{
  console.log(req.body);
  if((req.body.button==="Monday,") ||(req.body.button==="Tuesday,")|| (req.body.button==="Wednesday,") || (req.body.button==="Thursday,") || (req.body.button==="Friday,") || (req.body.button==="Saturday,") || (req.body.button==="Sunday,")){
    const neItem=req.body.listItem;
    const newItem= new Item(
      { name: neItem }
      );
      newItem.save().then(() => console.log('meowu'));
    // listItem.push(Item);
    res.redirect("/")
  }else{
      const neItem=new Item({
        name:req.body.listItem
      });
      async function run(){
        const Check=await List.findOne({ name: req.body.button })
        // console.log(Check.contains);
        Check.contains.push(neItem);
        Check.save();
        res.redirect(`/${req.body.button}`);        
      }
      run();
  }
});

// app.get("/work",(req, res)=>{
//   res.render("list", {kindofday : "work", listWork: Worklist});
// })

// app.post("/work",(req, res)=>{
//   let workitem=req.body.listItem
//   Worklist.push(workitem);
//   res.redirect("/work");
// })

app.listen(PORT, ()=>{
    console.log("Server listning successfully on port 3000");
})



