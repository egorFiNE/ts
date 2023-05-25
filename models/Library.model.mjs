import { Sequelize, Model } from 'sequelize';

export class Library extends Model {
  static structure = {
    title: {
      type: Sequelize.DataTypes.STRING(500),
      allowNull: false
    },

    description: {
      type: Sequelize.DataTypes.STRING(5000),
      defaultValue: null
    }
  }

  static options = {
    timestamps: false
  }
}
