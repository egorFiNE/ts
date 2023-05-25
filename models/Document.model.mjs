import { Sequelize, Model } from 'sequelize';

export class Document extends Model {
  static structure = {
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
