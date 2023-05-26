import { Sequelize, Model } from 'sequelize';

export class Document extends Model {
  static structure = {
    libraryId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },

    title: {
      type: Sequelize.DataTypes.STRING(500),
      allowNull: false
    },

    url: {
      type: Sequelize.DataTypes.STRING(500),
      allowNull: false
    }


  }

  static options = {
    timestamps: false
  }
}
