import { Sequelize, Model } from 'sequelize';
import { registerType } from 'pgvector/sequelize';
import { EMBEDDING_LENGTH } from '../lib/Embeddings.mjs';
import { randomUUID } from 'crypto';

registerType(Sequelize);

export class Search extends Model {
  static structure = {
    query: {
      type: Sequelize.DataTypes.STRING(1000),
      allowNull: false
    },

    modelName: {
      type: Sequelize.DataTypes.STRING(250),
      allowNull: false
    },

    embedding: {
      type: Sequelize.DataTypes.VECTOR(EMBEDDING_LENGTH),
      allowNull: false
    },

    results: {
      type: Sequelize.DataTypes.JSON,
      allowNull: false
    },

    summary: {
      type: Sequelize.DataTypes.STRING(5000),
      defaultValue: null
    },

    shareId: {
      type: Sequelize.DataTypes.STRING(4),
      defaultValue: null
    }
  }

  share() {
    this.shareId = this.shareId || randomUUID().substring(0, 4);
  }

  static options = {
    timestamps: true,
    indexes: [
      {
        fields: [ 'query', 'modelName' ],
        unique: true
      }
    ]
  }
}
