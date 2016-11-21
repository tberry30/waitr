var Waitlist = require('../models/WaitlistModel');
var User = require('../models/UserModel');

var findBy_Id = function (list, id) {
  for (var i = 0; i < list.length; i++) {
    if (list[i]._id.toString() === id) {
      return i;
    }
  }
};

module.exports = {
  create: function (req, res) {
    Waitlist.create(req.body, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      // console.log(result);
      return res.status(200).send(result, "successfully created Waitlist!");
    });
  },
  read: function (req, res) {
    Waitlist
      .find(req.query)
      .exec(function (err, result) {
        if (err) {
          return res.status(500).send(err);
        }
        // console.log("back end working",result)
        res.send(result);
      });
  },
  update: function (req, res) {
    Waitlist.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
      if (err) {
        return res.status(500).send(err);
      }
      Waitlist.findById(req.params.id, function (err, result) {
        if (err) {
          return res.status(500).send(err);
        }
        res.send(result);
      });
    });
  },
  delete: function (req, res) {
    Waitlist.findByIdAndRemove(req.params.id, function (err, result) {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  },
  addToList: function (req, res) {
    Waitlist.findById(req.params.id, function (err, waitList) {
      //if there is an error, don't try to update anything
      if (err || !waitList) {
        return res.status(500).send(err);
      }
      waitList.list.push(req.body);
      waitList.save();

      //NEW CODE!!!!

      res.send(waitList.list[waitList.list.length - 1]);
    });
  },
  removeFromList: function (req, res, next) {
    Waitlist.findById(req.params.id, function (err, waitList) {
      if (err) {
        return res.status(500).send(err);
      }
      //find the position of the list item
      var pos = findBy_Id(waitList.list, req.params.listId);

      var removed = waitList.list.splice(pos, 1);
      waitList.save();
      console.log(removed[0]);
      if (removed[0].user_id) {
        console.log("user has a user_id property");
        User.findById(removed[0].user_id, function (err, user) {
          if (err) {
            return res.status(500).send(err);
          }
          user.inWaitList = undefined;
          console.log("successfully deleted user property");
          user.save(function (err, result) {
            if (err) {
              console.error(err);
            } else {
              console.log("successfully removed property");
            }
          });
        })
      }
      res.send({ pos: pos });
    })
  },
  getFromList: function (req, res) {
    Waitlist.findById(req.params.id, function (err, waitList) {
      if (err) {
        return res.status(500).send(err);
      }
      //find the person in the waitlist
      var pos = findBy_Id(waitList.list, req.params.listId);
      res.send(waitList.list[pos]);
    })
  },
  updateListEntry: function (req, res) {
    Waitlist.findById(req.params.id, function (err, waitList) {
      if (err) {
        return res.status(500).send(err);
      }
      var pos = findBy_Id(waitList.list, req.params.listId);
      //console.log("position is: ", pos);
      //console.log("req.body is: ", req.body);
      //console.log("element is: ", waitList.list[pos]);

      for (var p in req.body) {
        console.log(p);
        waitList.list[pos][p] = req.body[p];
        console.log("the new property is: ", waitList.list[pos][p]);
      }

      waitList.save(function (err, result) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send(result);
        }
      });
    })
  }
}
