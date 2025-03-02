export function calcStats(catsInfo)
{
    const stats = {};
    calcInfo.forEach(({ country }) => {
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