import { Sequelize, Model } from 'sequelize';
import { registerType } from 'pgvector/sequelize';
import { EMBEDDING_LENGTH } from '../lib/Embeddings.mjs';

registerType(Sequelize);

export class Chunk extends Model {
  static structure = {
    documentId: {
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

  static async search({ libraryId, embedding, modelName, limit = 100 }) {
    if (embedding.length !== EMBEDDING_LENGTH) {
      throw new Error(`Embedding length should be ${EMBEDDING_LENGTH}`);
    }

    const result = await this.sequelize.query(
      `SELECT
          "Chunk"."id", "libraryId", "documentId", "sequence", "wordCount", "text", "start", "end",
          COSINE_DISTANCE(embedding, :embedding) AS distance,
          "Document"."title", "Document"."url"
        FROM "Chunk" JOIN "Document" ON "documentId" = "Document"."id"
        WHERE "libraryId" = :libraryId AND "modelName" = :modelName
        ORDER BY distance ASC
        LIMIT :limit;
      `,
      {
        replacements: { libraryId, modelName, embedding: `[${embedding}]`, limit },
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
        fields: [ 'wordCount', 'documentId', 'modelName', 'sequence' ],
        unique: true
      },
      {
        fields: [ 'modelName' ]
      }
    ]
  };
}
