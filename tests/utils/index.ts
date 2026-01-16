import { DataSource } from "typeorm";

export const truncateTable = async (connections: DataSource) => {
  const entities = connections.entityMetadatas;
  for (const entity of entities) {
    const repository = connections.getRepository(entity.name);
    await repository.clear();
  }
};

export const isJwt = (token: string | null) => {
  if (token === null) {
    return false;
  }
  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  try {
    parts.forEach((part) => {
      Buffer.from(part, "base64").toString("utf-8");
    });
    return true;
  } catch (error) {
    console.log("Error in checking valid jwt", error);
    return false;
  }
};
