const { loadData } = require("./loadData");
const { calcStats } = require("./calcStats");

async function calcStatsFromAPI()
{
    const data = await loadData();
    return calcStats(data);
}

module.exports = { calcStatsFromAPI };
