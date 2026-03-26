import { db } from "../config/db.js";
import type { Team } from "../types/Team.js";

export const getTeams = async () => {
  const query = `
    SELECT id, name, members, created_at, updated_at
    FROM dev.team
    ORDER BY id
  `;

  const { rows } = await db.query(query);
  return rows as Team[];
};

export const createTeam = async (name: string, members: number) => {
  const query = `
    INSERT INTO dev.team (name, members)
    VALUES ($1, $2)
    RETURNING id, name, members, created_at, updated_at
  `;

  const values = [name, members];
  const { rows } = await db.query(query, values);
  return rows[0] as Team;
};

export const joinTeam = async (teamId: number, userId: number) => {
  const query = `
    INSERT INTO dev.team_members (team_id, user_id)
    VALUES ($1, $2)
    RETURNING team_id, user_id
  `;

  const values = [teamId, userId];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const leaveTeam = async (userId: number) => {
  const query = `
    DELETE FROM dev.team_members
    WHERE user_id = $1
    RETURNING team_id, user_id
  `;

  const values = [userId];
  const { rows } = await db.query(query, values);
  return rows[0];
};
