var express = require("express");
var passport = require("passport");
var flash = require("connect-flash");
var User = require("../models/user");

var Token = require("../models/token");

// const Cart = require("../public/javascripts/Cart");
const Security = require("../public/javascripts/Security");

var router = express.Router();

var Cart = require("../models/cart");
var nodemailer = require("nodemailer");

var Material = require("../models/material");

var Order = require("../models/order");

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",

  auth: {
    user: "YESARI EMAIL",
    pass: "YESARI PASSWORD"
  }
});

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect("/login");
};
module.exports = function(passport) {
  router.post("/endpoint", function(req, res) {
    var obj = {};
    console.log("body: lol " + JSON.stringify(req.body));
    res.send(req.body);
  });

  router.get("/lol", function(req, res) {
    res.render("lol");
  });

  /* GET login page. */
  router.get("/", function(req, res) {
    if (!req.session.cart) {
      req.session.cart = {
        items: "",
        totals: 0.0,
        formattedTotals: ""
      };
    }

    Material.getImages(function(err, products) {
      if (err) throw err;
      let format = new Intl.NumberFormat({
        style: "currency",
        currency: "Rs."
      });

      products.forEach(product => {
        product.formattedPrice = format.format(product.price);
      });
      res.render("index", {
        user: req.user,
        products: products,
        nonce: Security.md5(req.sessionID + req.headers["user-agent"])
      });
    });
  });

  router.get("/login", function(req, res, next) {
    // Display the Login page with any flash message, if any
    res.render("login", { message: req.flash("message") });
  });
  router.get("/pro", function(req, res, next) {
    // Display the Login page with any flash message, if any
    res.render("pro", { user: req.user });
  });

  /* Handle Login POST */
  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

  /* GET Registration Page */
  router.get("/signup", function(req, res) {
    res.render("register", { message: req.flash("message") });
  });

  /* Handle Registration POST */
  router.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  router.get("/material", function(req, res) {
    if (req.isAuthenticated()) {
      res.render("material", { user: req.user });
    } else {
      console.log("log in to continue");
      res.redirect("login");
    }
  });

  router.get("/addList", function(req, res) {
    if (req.isAuthenticated()) {
      res.render("addList", { user: req.user });
    } else {
      console.log("log in to continue");
      res.redirect("login");
    }
  });

  router.get("/profile", isAuthenticated, function(req, res) {
    User.findOne({ _id: req.user._id })
      .populate("materials")
      .exec(function(err, doc) {
        if (!err) {
          console.log("Doc", doc);
          res.render("profile", { user: doc });
        }
      });

    // res.render('profile', {user: req.user});
  });
  router.get("/product/:id", function(req, res, next) {
    var productId = req.params.id;

    Material.findById(productId, function(err, product) {
      if (err) {
        return res.redirect("/");
      } else res.render("product", { product: product, user: req.user });
    });
  });

  router.get("/lola", function(req, res) {
    res.render("lola");
  });

  router.get("/diyproducts", function(req, res) {
    if (!req.session.cart) {
      req.session.cart = {
        items: "",
        totals: 0.0,
        formattedTotals: ""
      };
    }

    Material.getImages(function(err, products) {
      if (err) throw err;
      let format = new Intl.NumberFormat({
        style: "currency",
        currency: "Rs."
      });

      products.forEach(product => {
        product.formattedPrice = format.format(product.price);
      });
      res.render("diyproducts", {
        user: req.user,
        products: products,
        nonce: Security.md5(req.sessionID + req.headers["user-agent"])
      });
    });
  });

  router.get("/foo", function(req, res) {
    Material.find({}, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render("foo", { data: data });
      }
    });
  });
  router.get("/ind2", function(req, res) {
    res.render("ind2");
  });
  router.get("/search", function(req, res) {
    res.render("search");
  });
  router.get("/searchList", function(req, res) {
    res.render("searchList");
  });

  /* Handle Logout */
  router.get("/signout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  router.post("/resend", function(req, res, next) {
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }

    User.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        return res
          .status(400)
          .send({ msg: "Unable to find a user with the associated email." });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .send({ msg: "Account already verified. Please Log In." });
      }

      var token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex")
      });

      token.save(function(err) {
        if (err) {
          res.status(500).send({ msg: err.message });
        }

        var transporter = nodemailer.createTransport({
          service: "Sendgrid",
          auth: {
            user: "doityesari2017@gmail.com",
            pass: "yesarido2017"
          }
        });

        var mailOptions = {
          from: "no-reply@codemoto.io",
          to: user.email,
          subject: "Account Verification Token",
          text:
            "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/confirmation/" +
            token.token
        };

        transporter.sendMail(mailOptions, function(err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res
            .status(200)
            .send("A verification email has been sent to " + user.email + ".");
        });
      });
    });
  });

  router.get("/add-to-cart/:id", function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Material.findById(productId, function(err, product) {
      if (err) {
        return res.redirect("/");
      }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart.items, "addtocart-id");
      res.redirect("/");
    });
  });
  router.get("/cart", function(req, res, next) {
    console.log(req.session.cart, "lllllll");
    if (
      !req.session.cart ||
      req.session.cart.totalQty <= 0 ||
      req.session.cart.items.length < 1
    ) {
      return res.render("cart", { products: null, user: req.user });
    }
    var cart = new Cart(req.session.cart);
    res.render("cart", {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      user: req.user
    });
  });

  router.get("/reduce/:id", function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect("/cart", { user: req.user });
  });

  router.get("/remove/:id", function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect("/cart");
  });

  router.get("/checkout", isAuthenticated, function(req, res, next) {
    console.log(req.session.cart, "checkout");
    if (!req.session.cart || req.session.cart.totals <= 0) {
      return res.redirect("/cart");
    }
    console.log(req.session.cart, "cart");
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash("error")[0];
    res.render("checkout", {
      total: cart.totalPrice,
      errMsg: errMsg,
      noError: !errMsg,
      user: req.user
    });
  });

  router.post("/checkout", isAuthenticated, function(req, res, next) {
    if (!req.session.cart) {
      return res.redirect("/cart");
    }
    var cart = new Cart(req.session.cart);

    // var stripe = require("stripe")(
    //     "sk_test_fwmVPdJfpkmwlQRedXec5IxR"
    // );

    // stripe.charges.create({
    //     amount: cart.totalPrice * 100,
    //     currency: "usd",
    //     source: req.body.stripeToken, // obtained with Stripe.js
    //     description: "Test Charge"
    // }, function(err, charge) {
    //     if (err) {
    //         req.flash('error', err.message);
    //         return res.redirect('/checkout');
    //     }

    const mailOptions = {
      from: "doityesari2017@gmail.com", // sender address
      to: req.body.eaddress, // list of receivers
      subject: "Subject of your email", // Subject line
      html: "<p>Your html here</p>" // plain text body
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) console.log(err);
      else console.log(info);
    });
    var order = new Order({
      user: req.user,
      cart: cart,
      eaddress: req.body.eaddress,
      address: req.body.address,
      contact: req.body.contact,
      name: req.body.name
      // paymentId: charge.id
    });
    order.save(function(err, result) {
      req.flash(
        "success",
        "Message has been sent! We shall contact you regarding your order."
      );
      req.session.cart = null;
      res.redirect("/");
    });
  });

  return router;
};
