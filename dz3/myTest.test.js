const { calcStatsFromAPI } = require("./main");

test("calcStatsFromAPI fetch mock", async () => {
    const mockData = [
        { breed: "Turkish Van", country: "United Kingdom" },
        { breed: "Russian Blue", country: "Russia" }
    ];
    
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({ data: mockData, next_page_url: null })
        })
    );
    
    const stats = await calcStatsFromAPI();
    expect(stats).toEqual({ "United Kingdom": 1, "Russia": 1 });
    
    global.fetch.mockRestore();
});