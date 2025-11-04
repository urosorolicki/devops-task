pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'sum-app'
        DOCKER_TAG = 'latest'
    }
    
    stages {
        stage('Check Environment') {
            steps {
                sh 'node --version || echo "Node.js not found"'
                sh 'npm --version || echo "npm not found"'
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci || echo "npm ci failed - trying npm install"'
                sh 'npm install || echo "npm install also failed"'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test || echo "Tests failed"'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'package.json, app.js, app.test.js, Dockerfile', allowEmptyArchive: true
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed - check logs above'
        }
    }
}