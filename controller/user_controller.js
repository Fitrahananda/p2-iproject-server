const { User, Profile, Partner } = require("../models");
const { tokenCreate } = require("../helper/jwt");
const { decryption, encrypt } = require("../helper/encryption");
const nodemailer = require("nodemailer");

class userController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      await User.create({ email, password });
      res.status(201).json({
        email: email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "Email is required" };
      }

      if (!password) {
        throw { name: "Password is required" };
      }

      const Users = await User.findOne({
        where: {
          email,
        },
      });
      if (!Users) {
        throw { name: "Invalid email/password" };
      }

      if (!decryption(password, Users.password)) {
        throw { name: "Invalid email/password" };
      }

      const token = tokenCreate({
        id: Users.id,
        email: Users.email,
      });

      res.status(200).json({
        access_token: token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async passwordForgot(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        throw { name: "Email is required" };
      }
      const Users = await User.findOne({
        where: {
          email,
        },
      });
      if (!Users) {
        throw { name: "Wrong Email" };
      }

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "fitrahdummy123@gmail.com",
          pass: "fitrah6969",
        },
      });

      // send mail with defined transport object
      let mailOptions = {
        from: "fitrahdummy123@gmail.com",
        to: email,
        subject: "Reset your password!",
        html: `<p>Click <a href="https://daiting-kacau.web.app/reset/${Users.id}">here</a> to reset your password</p>`,
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetForgot(req, res, next) {
    try {
      console.log("asdf");
      console.log(req.body);
      const { password1, password2, id } = req.body;
      if (!password1 || !password2) {
        throw { name: "Password is required" };
      }
      if (password1 !== password2) {
        console.log("asas");
        throw { name: "Password not match" };
      }

      await User.update({ password: encrypt(password1) }, { where: { id } });

      res.status(200).json({
        message: "Success change password",
      });
    } catch (err) {
      next(err);
    }
  }

  static async profile(req, res, next) {
    try {
      const { id } = req.user;
      const Users = await User.findByPk(id, {
        include: [Profile],
      });

      if (!Users.Profile) {
        throw { name: "Add Profile First" };
      }
      res.status(200).json(Users);
    } catch (err) {
      next(err);
    }
  }

  static async addprofile(req, res, next) {
    try {
      const { id } = req.user;
      const { name, gender, age, phoneNumber, address } = req.body;
      if (!req.file) {
        throw { name: "Photo is required" };
      }
      await Profile.create({
        name,
        gender,
        age,
        phoneNumber,
        address,
        photoProfile: req.file.originalname,
        UserId: id,
      });

      res.status(200).json({
        photo: req.file,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listProfile(req, res, next) {
    try {
      let Users = "";

      const Usergender = await Profile.findOne({
        where: {
          UserId: req.user.id,
        },
      });

      if (Usergender.gender === "male") {
        Users = await Profile.findAll({
          where: {
            gender: "female",
          },
        });
      } else {
        Users = await Partner.findAll({
          where: {
            ProfileId: req.user.id,
          },
          include: [
            {
              model: User,
              include: Profile,
            },
          ],
        });
        Users = Users.map((e) => {
          return e.User.Profile;
        });
      }
      if (!Users) {
        throw { name: "Data not found" };
      }
      res.status(200).json(Users);
    } catch (err) {
      next(err);
    }
  }

  static async addPartner(req, res, next) {
    try {
      const { id } = req.user;
      const { ProfileId } = req.body;
      const find = await Partner.findOne({
        where: {
          UserId: id,
        },
      });

      if (find) {
        throw { name: "You can't add more" };
      }
      const partner = await Partner.create({
        UserId: id,
        ProfileId,
      });
      res.status(201).json(partner);
    } catch (error) {
      next(error);
    }
  }

  static async listPartner(req, res, next) {
    try {
      const partner = await Partner.findOne({
        where: {
          UserId: req.user.id,
        },
        include: [Profile],
      });
      if (!partner) {
        throw { name: "Data not found" };
      }
      res.status(200).json(partner);
    } catch (error) {
      next(error);
    }
  }

  static async recievedRequest(req, res, next) {
    try {
      const partner = await Partner.findAll({
        where: {
          UserId: req.user.id,
        },
        include: [Profile],
      });

      res.status(200).json(partner);
    } catch (error) {
      next(error);
    }
  }

  static async cencelRequest(req, res, next) {
    try {
      const { id } = req.body;
      await Partner.destroy({
        where: {
          id,
        },
      });
      res.status(201).json({
        message: "Success delete",
      });
    } catch (error) {
      next(error);
    }
  }

  static async acceptRequest(req, res, next) {
    try {
      const { id } = req.body;
      await Partner.update(
        { status: "accepted" },
        {
          where: {
            ProfileId: req.user.id,
            UserId: id,
          },
        }
      );
      await Partner.destroy({
        where: {
          status: "pending",
        },
      });
      res.status(201).json({
        message: "accepted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async partner(req, res, next) {
    try {
      let Users = "";
      const Usergender = await Profile.findOne({
        where: {
          UserId: req.user.id,
        },
      });
      if (Usergender.gender === "male") {
        Users = await Partner.findOne({
          where: {
            status: "accepted",
            UserId: req.user.id,
          },
        });
        Users = await User.findByPk(Users.ProfileId, {
          include: [Profile],
        });
        Users = [Users.Profile];
      } else {
        Users = await Partner.findOne({
          where: {
            status: "accepted",
            ProfileId: req.user.id,
          },
        });
        Users = await User.findByPk(Users.UserId, {
          include: [Profile],
        });

        Users = [Users.Profile];
      }

      if (!Users) {
        throw { name: "Data not found" };
      }
      res.status(200).json(Users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
