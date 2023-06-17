import { Router } from "express";

const route = Router();

route.get('/about', (req,res)=>{res.render("about")});
route.get('/blog', (req,res)=>{res.render("blog")});
route.get('/contact', (req,res)=>{res.render("contact")});
route.get('/', (req,res)=>{res.render("index")});
route.get('/service', (req,res)=>{res.render("service")});

export default route;