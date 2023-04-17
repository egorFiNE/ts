import { Sequelize, Model } from 'sequelize';
import { registerType } from 'pgvector/sequelize';
import { EMBEDDING_LENGTH } from '../lib/Embeddings.mjs';

registerType(Sequelize);

export class Chunk extends Model {
  static structure = {
    lecture: {
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
    },
  }

  static async search(embedding, modelName, limit = 100) {
    if (embedding.length !== EMBEDDING_LENGTH) {
      throw new Error(`Embedding length should be ${EMBEDDING_LENGTH}`);
    }

    const result = await this.sequelize.query(`
        SELECT "id", "lecture", "sequence", "wordCount", "text", "start", "end", COSINE_DISTANCE(embedding, :embedding) AS distance
        FROM "Chunk"
        WHERE "modelName" = :modelName
        ORDER BY distance ASC
        LIMIT :limit;
      `,
      {
        replacements: { modelName, embedding: `[${embedding}]`, limit },
        type: this.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    return result;
  }

  static async getNeighbours(chunks, range = 1, modelName) {
    const chunksIdByEntityId = chunks.reduce((acc, chunk) => {
      if (!acc[chunk.entityId]) {
        acc[chunk.entityId] = [];
      }

      acc[chunk.entityId].push(chunk.chunkId);

      return acc;
    }, {});

    const clauses = Object.keys(chunksIdByEntityId).map(entityId => {
      const chunkIds = chunksIdByEntityId[entityId];

      const uniqueChunkIds = new Set(chunkIds);
      chunkIds.forEach(chunkId => {
        uniqueChunkIds.add(chunkId);
        for (let i = 1; i <= range; i++) {
          uniqueChunkIds.add(chunkId + i);
          uniqueChunkIds.add(chunkId - i);
        }
      });

      const chunkIdsStr = [...uniqueChunkIds].join(', ');

      return `"entityId" = ${entityId} AND "chunkId" IN (${chunkIdsStr})`;
    });

    const clause = clauses.join(' OR ');

    const neighbours = await this.sequelize.query(`
      SELECT id, text, prefix, suffix, "chunkId", "entityId", "fullStart", "fullEnd"
      FROM "Chunk"
      WHERE ("modelName" = ?) AND (${clause});
    `, {
      type: this.sequelize.QueryTypes.SELECT,
      replacements: [ modelName ],
      raw: true
    });

    return neighbours;
  }

  static options = {
    timestamps: false,
    indexes: [
      {
        fields: [ 'wordCount', 'lecture', 'modelName', 'sequence' ],
        unique: true
      },
      {
        fields: [ 'modelName' ]
      }
    ]
  }
}
