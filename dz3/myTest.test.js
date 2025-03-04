
const { calcStatsFromAPI } = require("./main");

test("calcStatsFromAPI fetch mock", async () => {
    const mockData = [
        { breed: "Turkish Van", country: "United Kingdom" },
        { breed: "York Chocolate", country: "United States (New Yourk)" }
    ];
    
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({ data: mockData, next_page_url: null })
        })
    );
    
    const stats = await calcStatsFromAPI();
    expect(stats).toEqual({ "United Kingdom": 1, "United States (New Yourk)": 1 });
    
    global.fetch.mockRestore();
});