# Temperature Converter — Jenkins Pipeline

A temperature converter app (Celsius, Fahrenheit, Kelvin) paired with a full Jenkins CI/CD pipeline demonstrating automated build, test, and deployment.

## Features

- Convert between Celsius, Fahrenheit, and Kelvin
- Automated Jenkins pipeline via Jenkinsfile
- Unit tests with coverage reporting
- Docker containerization

## Tech Stack

- **App**: Node.js / JavaScript
- **CI/CD**: Jenkins
- **Testing**: Jest
- **Containerization**: Docker

## Getting Started

```bash
git clone https://github.com/Salmanahmed1078/Temperature-Converter-Jenkines-Pipeline.git
cd Temperature-Converter-Jenkines-Pipeline
npm install
npm test
node app.js
```

## Jenkins Pipeline Stages

1. **Checkout** — Pull source code
2. **Install** — Install dependencies
3. **Test** — Run test suite with coverage
4. **Build** — Build Docker image
5. **Deploy** — Push and deploy

## License

MIT
