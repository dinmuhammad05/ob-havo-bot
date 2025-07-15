const {config} = require('dotenv')
const { Telegraf } = require("telegraf");
const axios = require("axios");

config();

const bot = new Telegraf(process.env.TOKEN);
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

bot.start((ctx) => {
  ctx.reply("🌤 Ob-havo botiga xush kelibsiz!\nShahar nomini yuboring:");
  console.log(ctx.from);

});

bot.on("text", async (ctx) => {
  const city = ctx.message.text;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric&lang=uz`;
    const response = await axios.get(url);
    const data = response.data;

    const weather = data.weather[0].description;
    const temp = data.main.temp;
    const feels_like = data.main.feels_like;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    console.log("So'rov URL:", url);

    ctx.reply(
      `🌍 *${data.name}* uchun ob-havo:\n` +
      `🌡 Harorat: *${temp}°C* (his qilinadi: ${feels_like}°C)\n` +
      `🌤 Holat: ${weather}\n` +
      `💧 Namlik: ${humidity}%\n` +
      `💨 Shamol tezligi: ${wind} m/s`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    ctx.reply("❌ Shahar topilmadi yoki API xatolik berdi.");
    console.error(error.message);
  }
});

bot.launch();
console.log("🚀 Ob-havo bot ishga tushdi.");
