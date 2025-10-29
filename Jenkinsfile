pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  parameters {
    string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build from')
    string(name: 'STUDENT_NAME', defaultValue: 'Salman Ahmed')
    choice(name: 'ENVIRONMENT', choices: ['dev', 'qa', 'prod'], description: 'Select environment')
    booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run Jest tests after build')
  }

  environment {
    APP_VERSION = "1.0.${BUILD_NUMBER}"
    MAINTAINER = "Salman Ahmed"
  }

  stages {
    stage('Intro') {
      steps {
        echo "================ Jenkins Build ================="
        echo "Name: ${params.STUDENT_NAME}"
        echo "==============================================="
      }
    }

    stage('Checkout') {
      steps {
        echo "Checking out branch: ${params.BRANCH_NAME}"
        echo "Student Name: ${params.STUDENT_NAME}"
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        echo 'Installing required packages...'
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        echo "Building version ${APP_VERSION} for ${params.ENVIRONMENT} environment by ${params.STUDENT_NAME}"
        sh '''
          echo "Simulating build process..."
          mkdir -p build
          cp *.js build/ 2>/dev/null || true
          cp -r src build/src
          echo "Build successful for ${STUDENT_NAME}"
          echo "Build completed successfully!"
          echo "App version: ${APP_VERSION}" > build/version.txt
        '''
      }
    }

    stage('Test') {
      when {
        expression { return params.RUN_TESTS }
      }
      steps {
        echo 'Running Jest tests...'
        sh 'npm test'
      }
    }

    stage('Package') {
      steps {
        echo "Creating zip archive for version ${APP_VERSION}"
        sh 'zip -r build_${APP_VERSION}.zip build'
      }
    }

    stage('Deploy (Simulation)') {
      steps {
        echo "Simulating deployment of version ${APP_VERSION} to ${params.ENVIRONMENT}"
      }
    }
  }

  post {
    always {
      echo 'Cleaning up workspace...'
      deleteDir()
    }
    success {
      echo "Pipeline succeeded! Version ${APP_VERSION} built and tested."
    }
    failure {
      echo 'Pipeline failed! Check console output for details.'
    }
  }
}


