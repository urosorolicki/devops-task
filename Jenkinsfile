pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'sum-app'
        DOCKER_TAG = 'latest'
        NODE_VERSION = '18'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        
        stage('Security Audit') {
            steps {
                script {
                    try {
                        bat 'npm audit --audit-level=high'
                    } catch (Exception e) {
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    env.DOCKER_IMAGE_ID = image.id
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                script {
                    bat """
                        docker run -d -p 3001:3000 --name test-container-${BUILD_NUMBER} ${DOCKER_IMAGE}:${DOCKER_TAG}
                        timeout /t 10
                        curl -f http://localhost:3001/ || exit 1
                        curl -f "http://localhost:3001/add?left=5&right=2" | findstr "\\"sum\\":7" || exit 1
                        docker stop test-container-${BUILD_NUMBER}
                        docker rm test-container-${BUILD_NUMBER}
                    """
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'Dockerfile, package.json', allowEmptyArchive: true
                script {
                    bat "docker save ${DOCKER_IMAGE}:${DOCKER_TAG} -o ${DOCKER_IMAGE}-${BUILD_NUMBER}.tar"
                    archiveArtifacts artifacts: "${DOCKER_IMAGE}-${BUILD_NUMBER}.tar", allowEmptyArchive: true
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        def image = docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        image.push()
                        image.push("${BUILD_NUMBER}")
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                try {
                    bat "docker stop test-container-${BUILD_NUMBER} || echo 'Container already stopped'"
                    bat "docker rm test-container-${BUILD_NUMBER} || echo 'Container already removed'"
                } catch (Exception e) {
                    echo 'Cleanup completed'
                }
            }
            cleanWs()
        }
    }
}