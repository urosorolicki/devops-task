pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'sum-app'
        DOCKER_TAG = 'latest'
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
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                script {
                    sh """
                        docker run -d -p 3001:3000 --name test-container-${BUILD_NUMBER} ${DOCKER_IMAGE}:${DOCKER_TAG}
                        sleep 10
                        curl -f http://localhost:3001/ || exit 1
                        curl -f "http://localhost:3001/add?left=5&right=2" | grep -q '"sum":7' || exit 1
                        docker stop test-container-${BUILD_NUMBER}
                        docker rm test-container-${BUILD_NUMBER}
                    """
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'Dockerfile, package.json', allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            script {
                try {
                    sh "docker stop test-container-${BUILD_NUMBER} || echo 'Container already stopped'"
                    sh "docker rm test-container-${BUILD_NUMBER} || echo 'Container already removed'"
                } catch (Exception e) {
                    echo 'Cleanup completed'
                }
            }
        }
    }
}