function calcStats(catsInfo)
{
    const stats = {};
    catsInfo.forEach(({ country }) => {
        if (stats[country])
        {
            stats[country] += 1;
        }
        else
        {
            stats[country] = 1;
        }
    });
    return stats;
}

module.exports = { calcStats };