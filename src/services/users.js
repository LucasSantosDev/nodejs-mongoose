const User = require("../models/user");
const {
  pagination,
  order,
  match,
  project,
  lookup,
  map,
  prepareAggregate,
} = require("../utils/aggregate");

module.exports = class UserService {
  async createUser(userData) {
    const newUser = new User(userData);

    return newUser.save();
  }

  async getAllUsers() {
    return User.find();
  }

  async getOneUser(id) {
    return User.findById(id);
  }

  async updateUser(userId, userData) {
    return User.findByIdAndUpdate(userId, userData, {
      new: true,
      //   upsert: true, -> Upsert cria um novo registro caso não encontre o registro com o ID
    });
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  async getReport(filters) {
    try {
      const query = [
        ...match([
          filters?.name
            ? { name: new RegExp(String(filters.name).toLowerCase(), "i") }
            : {},
          filters?.email
            ? { email: new RegExp(String(filters.email).toLowerCase(), "i") }
            : {},
          filters?.age ? { age: Number(filters.age) } : {},
        ]),
        ...order(filters?.orderColumn, filters?.orderDirection),
        ...pagination(filters?.perPage, filters?.page),
        ...lookup("comments", "author", "comments"),
        ...project({
          name: 1,
          email_user: "$email",
          comments: {
            ...map("$comments", "comment", {
              title: "$$comment.title",
              content: "$$comment.content",
            }),
          },
        }),
      ];

      const result = await User.aggregate(prepareAggregate(query)).exec();

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
};
