const converter = require('./converter');

test('Celsius to Fahrenheit', () => {
  expect(converter.celsiusToFahrenheit(0)).toBe(32);
});

test('Fahrenheit to Celsius', () => {
  expect(converter.fahrenheitToCelsius(32)).toBe(0);
});

test('Celsius to Kelvin', () => {
  expect(converter.celsiusToKelvin(0)).toBeCloseTo(273.15);
});

test('Kelvin to Celsius', () => {
  expect(converter.kelvinToCelsius(273.15)).toBeCloseTo(0);
});


