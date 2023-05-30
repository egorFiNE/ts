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
    },

    coverUrl: {
      type: Sequelize.DataTypes.STRING(500),
      defaultValue: null
    },

    slug: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    }

  }

  static options = {
    timestamps: true,
    createdAt:true,
    updatedAt: false
  }
}
