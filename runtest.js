const api=require("./api");
const expect=require("chai").expect;

describe("Weather and temperature", function () {
  describe("Weather", function() {
    it ("shows the temperature", function () {
      var temperature = api.getTemperature("Munich");

      expect(temperature).to.be.at.least(-273);
    });
  });

  describe("Time", function() {
    it ("shows the local time", function () {
      var time= api.getTime("Munich");
      expect(time).to.deep.contain(':');
    })
  });

});
