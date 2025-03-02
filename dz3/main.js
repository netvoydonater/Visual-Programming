import { loadData } from "./loadData.js";
import { calcStats } from "./calcStats.js";

export async function calcStatsFromAPI()
{
    const data = await loadData();
    return calcStats(data);
}