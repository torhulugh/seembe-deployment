# seembe-deployment

A deployment-ready Node.js application with CI/CD pipeline.

## Features

- Simple Node.js HTTP server
- Docker containerization
- GitHub Actions CI/CD workflow
- Automated testing and deployment

## Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- Docker (for containerized deployment)

### Running Locally

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Running with Docker

Build the Docker image:
```bash
docker build -t seembe-deployment .
```

Run the container:
```bash
docker run -p 3000:3000 seembe-deployment
```

### Testing

Run the test suite:
```bash
npm test
```

## Deployment

The application is configured with a GitHub Actions workflow that:
1. Runs tests on every push and pull request
2. Builds a Docker image
3. Validates the Docker image works correctly
4. Marks the application as ready for deployment on the main branch

The workflow can be triggered manually from the GitHub Actions tab or automatically on push to main/master branches.

## Project Structure

```
.
├── index.js          # Main application file
├── test.js           # Test suite
├── package.json      # Node.js dependencies and scripts
├── Dockerfile        # Docker configuration
└── .github/
    └── workflows/
        └── deploy.yml # CI/CD pipeline
```
