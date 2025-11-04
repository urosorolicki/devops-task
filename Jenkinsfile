pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'sum-app'
        DOCKER_TAG = 'latest'
    }
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Security Audit') {
            steps {
                script {
                    try {
                        sh 'npm audit --audit-level=high'
                    } catch (Exception e) {
                        echo 'Security audit failed, continuing...'
                        currentBuild.result = 'UNSTABLE'
                    }
                }
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
            echo 'Pipeline failed!'
        }
    }
}