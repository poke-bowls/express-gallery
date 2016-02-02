module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photo", {
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      uniqie: true,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Photo.belongsTo(models.User);
      }
    }
  });
  return Photo;
};