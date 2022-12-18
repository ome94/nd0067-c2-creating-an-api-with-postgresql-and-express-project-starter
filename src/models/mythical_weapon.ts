import client from "../database";

export type Weapon = {
  id: number;
  name: string;
  type: string;
  weight: number;
}


export class MythcalWeaponStore {

  async index(): Promise<Weapon[]> {
    try{
      const conn = await client.connect();
      const sql = `SELECT * FROM mythical_weapons;`;
      const results = await conn.query(sql);
      conn.release();
      return results.rows;
    }catch(err) {
      throw new Error(`Weapons retrieval failed. ${err}`);
    }
  }
}
