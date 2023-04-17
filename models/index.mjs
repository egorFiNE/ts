import { Sequelize } from 'sequelize';

const { Chunk } = await import('./Chunk.model.mjs');
const { Search } = await import('./Search.model.mjs');

const options = {
  logging: false,
  define: {
    freezeTableName: true
  }
};

let sequelize = null;

export async function init() {
  if (sequelize) {
    return sequelize;
  }

  sequelize = new Sequelize(process.env.SQL, options);

  try {
    await sequelize.authenticate();
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');

  } catch (error) {
    console.error('Unable to connect to the database:', error);

  }

  [ Chunk, Search ].forEach(table => table.init(table.structure, { ...table.options, sequelize }));

  await sequelize.sync();

  return sequelize;
}
