const AVAILABLE_TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

self.addEventListener("install", () => {
    console.log("SW installed");
});

self.addEventListener("activate", (event) => {
    console.log("SW is active");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    console.log("request is captured");
    const url = new URL(event.request.url);
    console.log(url);
    if (url.pathname === "/api/today"){
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const res = {
            currentMonth: currentMonth,
            currentYear: currentYear,
            selectedDay: today
        };
        event.respondWith(new Response(JSON.stringify(res)), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });
    } else if (url.pathname === "/api/slots"){
        const params = new URLSearchParams(url.searchParams);
        const selectedDay = Number(params.get("day"));
        const isWeekend = selectedDay === 0 || selectedDay === 6;
        const timesForDay = isWeekend ? AVAILABLE_TIMES.slice(0, 4) : AVAILABLE_TIMES;
        event.respondWith(new Response(JSON.stringify({
            times: timesForDay
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }));
    }
});
