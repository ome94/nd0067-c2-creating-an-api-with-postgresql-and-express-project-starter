import { MythcalWeaponStore, Weapon } from "../../models/mythical_weapon";

describe('Mythical Weapons Store tests', () => {
  const store = new MythcalWeaponStore();
  
  it('Expects index to be defined', () => {
    expect(store.index).toBeDefined();
  });

  it('Expects an empty database to be returned', async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });
});