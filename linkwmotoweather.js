const latitude = "1";
const longitude = "1";
const date = "2001-01-01";

fetch(
  `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&hourly=weather_code&timezone=America%2FNew_York`
)
  .then((blob) => blob.json())
  .then((response) => {
    const wmo = response.hourly.weather_code.slice(10, 19);
    let wmoCount = {
      1: 0,
      2: 0,
      3: 0,
      50: 0,
      60: 0,
      70: 0,
    };

    let wmoRemade = [];

    wmo.forEach((x) => {
      if (x <= 1) {
        wmoRemade.push(1);
      } else if (x > 1 && x < 4) {
        wmoRemade.push(x);
      } else if (x >= 50 && x < 60) {
        wmoRemade.push(50);
      } else if (x >= 60 && x < 70) {
        wmoRemade.push(60);
      } else if (x >= 70) {
        wmoRemade.push(70);
      }
    });

    wmoRemade.forEach((x) => {
      wmoCount[x]++;
    });

    if (wmo.every((x) => x < 4)) {
      const weather = wmo.reduce((a, c) => a + c, 0) / wmo.length;
      if (Math.round(weather) === 3) {
        console.log("cloudy");
      } else if (
        Math.round(weather) === 2 ||
        (Math.round(weather) <= 1 && wmoCount[1] < 5)
      ) {
        console.log("partlyCloudy");
      } else if (Math.round(weather) <= 1) {
        console.log("sunny");
      }
    } else if (
      wmoCount[50] < 3 &&
      wmoCount[60] < 3 &&
      wmoCount[70] < 3 &&
      wmoCount[50] + wmoCount[60] + wmoCount[70] < 3
    ) {
      console.log("cloudy");
    } else if (wmoCount[70] >= 3) {
      console.log("snowy");
    } else if (wmoCount[50] >= 3) {
      console.log("rain");
    } else if (wmoCount[60] >= 3) {
      console.log("Heavy rain");
    }
  });
