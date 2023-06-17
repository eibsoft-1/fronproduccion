import { Router } from "express";

const router = Router();

router.get("/back", (req, res)=>{
    //res.render("backoffice",{nombre:""});
    res.redirect("index");
})

export default router;