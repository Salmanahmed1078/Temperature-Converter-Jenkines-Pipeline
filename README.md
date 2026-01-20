# Temperature Converter — Jenkins CI/CD Pipeline

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Node](https://img.shields.io/badge/node-%3E%3D16-green)

A temperature unit converter (Celsius, Fahrenheit, Kelvin) built with Node.js and paired with a complete Jenkins CI/CD pipeline demonstrating automated build, test, Docker image creation, and deployment stages.

The application itself is deliberately simple — the purpose of this project is to demonstrate a production-quality DevOps pipeline configuration that can be adapted to any Node.js project.

---

## Table of Contents

- [Application Overview](#application-overview)
- [Pipeline Overview](#pipeline-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Running the Converter](#running-the-converter)
- [Running Tests](#running-tests)
- [Jenkins Pipeline Configuration](#jenkins-pipeline-configuration)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [Conversion Formulas](#conversion-formulas)
- [Contributing](#contributing)
- [License](#license)

---

## Application Overview

The converter exposes both a programmatic API (importable Node.js module) and a simple CLI for quick conversions:

```bash
node app.js 100 C F     # 100 Celsius → Fahrenheit → 212
node app.js 32  F C     # 32 Fahrenheit → Celsius → 0
node app.js 0   C K     # 0 Celsius → Kelvin → 273.15
```

It is fully unit-tested with 100% code coverage and validates all inputs before processing.

---

## Pipeline Overview

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Checkout │ -> │ Install  │ -> │   Test   │ -> │  Build   │ -> │  Deploy  │
│   Code   │    │   Deps   │    │ Coverage │    │  Docker  │    │   Image  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

Every push to `main` or `develop` triggers the full pipeline. Pull requests trigger up to the Test stage only (no deployment).

### Stage breakdown

| Stage | Command | Failure behavior |
|---|---|---|
| Checkout | SCM checkout | Abort |
| Install | `npm ci` | Abort |
| Lint | `npm run lint` | Fail build |
| Test | `npm test -- --coverage` | Fail build |
| Coverage Gate | Enforce >= 80% | Fail build |
| Build Image | `docker build` | Fail build |
| Push Image | Push to registry | Fail build |
| Deploy | Rolling update | Notify only |

---

## Tech Stack

| Component | Technology |
|---|---|
| Runtime | Node.js 18.x |
| Testing | Jest 29.x |
| Linting | ESLint |
| CI/CD | Jenkins 2.x |
| Containerization | Docker 24.x |
| Registry | Docker Hub or private registry |

---

## Prerequisites

**For local development:**
- [Node.js](https://nodejs.org/) >= 16.0.0
- [npm](https://www.npmjs.com/) >= 8.0.0

**For the full pipeline:**
- Jenkins server with the following plugins:
  - Pipeline
  - Docker Pipeline
  - Git
  - JUnit (for test result publishing)
  - Cobertura or Coverage (for coverage reports)
- Docker installed on the Jenkins agent
- Access to a Docker registry (Docker Hub or private)

---

## Local Setup

```bash
git clone https://github.com/Salmanahmed1078/Temperature-Converter-Jenkines-Pipeline.git
cd Temperature-Converter-Jenkines-Pipeline
npm install
```

---

## Running the Converter

### CLI usage

```bash
node app.js <value> <from_unit> <to_unit>
```

| Argument | Valid values |
|---|---|
| `value` | Any number (integer or decimal) |
| `from_unit` | `C` (Celsius), `F` (Fahrenheit), `K` (Kelvin) |
| `to_unit` | `C`, `F`, or `K` (different from from_unit) |

**Examples:**

```bash
node app.js 37 C F      # Body temperature: 98.6°F
node app.js 212 F C     # Boiling point: 100°C
node app.js 300 K C     # 300K in Celsius: 26.85°C
node app.js -40 C F     # -40°C = -40°F (they converge here)
```

### Programmatic usage

```js
const { convert } = require('./src/converter');

console.log(convert(100, 'C', 'F'));   // 212
console.log(convert(32,  'F', 'C'));   // 0
console.log(convert(0,   'C', 'K'));   // 273.15
console.log(convert(373.15, 'K', 'F')); // 212
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode during development
npm run test:watch
```

Coverage output is written to `coverage/` and also published as a Jenkins artifact. The pipeline enforces a minimum 80% coverage threshold — builds below this threshold are marked as failed.

---

## Jenkins Pipeline Configuration

### 1. Create a Jenkins Pipeline job

In Jenkins:
1. New Item > Pipeline
2. Under Pipeline, select **Pipeline script from SCM**
3. SCM: Git, Repository URL: your fork URL
4. Script Path: `Jenkinsfile`

### 2. Add credentials

In Jenkins > Credentials, add:
- `DOCKER_CREDENTIALS` — Docker Hub username and password
- `DEPLOY_SSH_KEY` — SSH private key for deployment target (if applicable)

### 3. Environment variables in Jenkinsfile

The `Jenkinsfile` reads the following environment variables:

```groovy
environment {
    DOCKER_IMAGE = 'your-dockerhub-username/temperature-converter'
    DOCKER_TAG   = "${BUILD_NUMBER}"
    REGISTRY     = 'https://registry.hub.docker.com'
}
```

Edit these in the Jenkinsfile before running the pipeline.

### 4. Trigger the pipeline

Push any commit to `main` — the webhook (configured in Jenkins > your repo) triggers the pipeline automatically. Or click **Build Now** to trigger manually.

---

## Docker

### Build the image locally

```bash
docker build -t temperature-converter:latest .
```

### Run the container

```bash
docker run --rm temperature-converter:latest node app.js 100 C F
# Output: 212
```

### Docker Compose (optional, for extended setups)

```bash
docker-compose up
```

This starts the converter with a simple HTTP wrapper at `http://localhost:3000`:

```bash
curl "http://localhost:3000/convert?value=100&from=C&to=F"
# {"result": 212, "unit": "F"}
```

---

## Project Structure

```
Temperature-Converter-Jenkines-Pipeline/
├── src/
│   ├── converter.js        # Core conversion logic
│   ├── validator.js        # Input validation
│   └── units.js            # Unit constants and metadata
├── tests/
│   ├── converter.test.js   # Unit tests for all conversions
│   ├── validator.test.js   # Input validation tests
│   └── edge-cases.test.js  # Boundary and error conditions
├── app.js                  # CLI entry point
├── server.js               # Optional HTTP wrapper
├── Jenkinsfile             # Pipeline definition
├── Dockerfile
├── docker-compose.yml
├── .eslintrc.js
├── jest.config.js
└── package.json
```

---

## Conversion Formulas

| From | To | Formula |
|---|---|---|
| Celsius | Fahrenheit | `(C × 9/5) + 32` |
| Celsius | Kelvin | `C + 273.15` |
| Fahrenheit | Celsius | `(F − 32) × 5/9` |
| Fahrenheit | Kelvin | `(F − 32) × 5/9 + 273.15` |
| Kelvin | Celsius | `K − 273.15` |
| Kelvin | Fahrenheit | `(K − 273.15) × 9/5 + 32` |

All results are rounded to 2 decimal places unless the result is a whole number.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Ensure `npm run lint` and `npm test` both pass
4. Open a pull request with a clear description

---

## License

MIT © Salman Ahmed
