const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) throw err;
        console.log("Image was deleted");
      });
    }); 
  }
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
          if (!sauce) {
            res.status(404).json({
              error: new Error("Sauce inexistante"),
            });
          }
          if (sauce.userId !== req.auth.userId) {
            res.status(400).json({
              error: new Error("Unauthorized request!"),
            });
          }
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({
                message: "Sauce supprimée!",
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: error,
              });
            });
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.like = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      try {
        sauce.usersLiked = sauce.usersLiked.filter(
          (userId) => userId !== req.auth.userId
        );
        sauce.usersDisliked = sauce.usersDisliked.filter(
          (userId) => userId !== req.auth.userId
        );

        if (req.body.like === 1) {
          sauce.usersLiked.push(req.auth.userId);
        } else if (req.body.like === -1) {
          sauce.usersDisliked.push(req.auth.userId);
        }
        sauce.likes = sauce.usersLiked.length;
        sauce.dislikes = sauce.usersDisliked.length;
      } catch (err) {
        console.log(err);
      }

      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .then(() => {
      res.status(200).json({ message: "like succeeded" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};
