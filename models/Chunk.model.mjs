import { Sequelize, Model } from 'sequelize';
import { registerType } from 'pgvector/sequelize';
import { EMBEDDING_LENGTH } from '../lib/Embeddings.mjs';

registerType(Sequelize);

export class Chunk extends Model {
  static structure = {
    library: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },

    document: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },

    sequence: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },

    text: {
      type: Sequelize.DataTypes.STRING(5000),
      allowNull: false
    },
    start: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    end: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },

    embedding: {
      type: Sequelize.DataTypes.VECTOR(EMBEDDING_LENGTH),
      defaultValue: null
    },

    wordCount: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },

    modelName: {
      type: Sequelize.DataTypes.STRING(250),
      allowNull: false
    }
  };

  static async search({ library, embedding, modelName, limit = 100 }) {
    if (embedding.length !== EMBEDDING_LENGTH) {
      throw new Error(`Embedding length should be ${EMBEDDING_LENGTH}`);
    }

    const result = await this.sequelize.query(
      `SELECT "id", "library", "document", "sequence", "wordCount", "text", "start", "end", COSINE_DISTANCE(embedding, :embedding) AS distance
        FROM "Chunk"
        WHERE "library" = :library AND "modelName" = :modelName
        ORDER BY distance ASC
        LIMIT :limit;
      `,
      {
        replacements: { library, modelName, embedding: `[${embedding}]`, limit },
        type: this.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    return result;
  }

  static options = {
    timestamps: false,
    indexes: [
      {
        fields: [ 'wordCount', 'library', 'document', 'modelName', 'sequence' ],
        unique: true
      },
      {
        fields: [ 'modelName' ]
      }
    ]
  };
}
