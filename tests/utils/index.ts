import { DataSource } from "typeorm";

export const truncateTable = async (connections: DataSource) => {
  const entities = connections.entityMetadatas;
  for (const entity of entities) {
    const repository = connections.getRepository(entity.name);
    await repository.clear();
  }
};
