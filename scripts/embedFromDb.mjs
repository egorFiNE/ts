import 'dotenv/config';
import { getEmbeddings, normalizeEmbedding } from '../lib/Embeddings.mjs';
import { init } from '../models/index.mjs';

const sequelize = await init();

const modelsToEmbedResults = await sequelize.models.Chunk.findAll({
  where: {
    embedding: {
      [sequelize.Sequelize.Op.eq]: null
    }
  },
  attributes: [
    [sequelize.Sequelize.fn('DISTINCT', sequelize.Sequelize.col('modelName')), 'modelName'],
  ],
  raw: true
});

const modelsToEmbed = modelsToEmbedResults.map(m => m.modelName);
if (modelsToEmbed.length == 0) {
  console.log("Nothing to embed");
  process.exit(0);
}

for (const modelName of modelsToEmbed) {
  const totalCount = await sequelize.models.Chunk.count({
    where: {
      modelName,
      embedding: {
        [sequelize.Sequelize.Op.eq]: null
      }
    }
  });

  console.log(`Embedding ${totalCount} entries on model ${modelName}:`);

  let doneCount = 0;

  do {
    const entries = await sequelize.models.Chunk.findAll({
      where: {
        modelName,
        embedding: {
          [sequelize.Sequelize.Op.eq]: null
        }
      },
      limit: 200
    });

    if (entries.length == 0) {
      console.log(`Model ${modelName} done.`);
      break;
    }

    const text = entries.map(e => e.text);

    const embeddings = await getEmbeddings(modelName, text);

    doneCount += embeddings.length;
    console.log(`\t${doneCount}/${totalCount} done`);

    await sequelize.transaction(async transaction => {
      for (let i=0; i<entries.length; i++) {
        entries[i].embedding = normalizeEmbedding(embeddings[i]);
        await entries[i].save({ transaction });
      }
    });

  } while (true);
}

console.log("All done");

await sequelize.close();

