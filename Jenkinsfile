pipeline {
  agent any

  parameters {
    string(name: 'BUILD_ENV', defaultValue: 'staging', description: 'Environment for Docker Build (e.g., dev, staging)')
  }

  environment {
    DOCKER_IMAGE = 'erangawebmotech/sa-host'
    CONTAINER_NAME = 'sa-host-container'
    TARGET = '173.231.206.242'
  }

  stages {   
    
    stage('Detect Branch & Set BUILD_ENV') {
      when { expression { return params.BUILD_ENV == '' } }
      steps {
        script {
          if (env.BRANCH_NAME == 'development') {
            env.BUILD_ENV = 'dev'
          } else if (env.BRANCH_NAME == 'staging') {
            env.BUILD_ENV = 'staging'
          }
          echo "🔁 Auto-set BUILD_ENV = ${env.BUILD_ENV} based on branch"
        }
      }
    }


    stage('Prepare .env for Build') {
      steps {
        script {
          def credId = "sa-env-${BUILD_ENV}"

          withCredentials([file(credentialsId: credId, variable: 'ENV_FILE')]) {
            sh """
              echo "📄 ENV_FILE path: \$ENV_FILE"
              cp \$ENV_FILE .env.${BUILD_ENV}
              echo "✅ .env file created. Contents:"
              echo "----------------------------"
              grep -v '^#' .env.${BUILD_ENV}
              echo "----------------------------"
            """
          }
        }
      }
    }


    stage('Build Docker Image') {
      steps {
        script {
          env.IMAGE_TAG = "build-${env.BUILD_ID}"
        }
        sh """
          echo "🔧 Building Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}  : ${BUILD_ENV}"
          docker build --build-arg BUILD_ENV=${BUILD_ENV} -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
          docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
        """
      }
    }

    stage('Push to Docker Registry') {
      steps {
        withCredentials([usernamePassword(credentialsId: '6872b5e1-1a04-405a-9e96-aed099538e12', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "📤 Logging in to Docker Hub..."
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push $DOCKER_IMAGE:$IMAGE_TAG
            docker push $DOCKER_IMAGE:latest
          '''
        }
      }
    }
    

    stage('Deploy on Server') {
      steps {
        sshagent(credentials: ['145528a7-81c6-42cf-b553-153db5b3b411']) {
          sh """
            echo "🚀 Deploying Docker container on remote server..."

            ssh -o StrictHostKeyChecking=no root@$TARGET << EOF
docker pull ${DOCKER_IMAGE}:latest

echo "🛑 Stopping and removing existing container..."
docker stop ${CONTAINER_NAME} || true
docker rm ${CONTAINER_NAME} || true

echo "🧹 Cleaning up unused images..."
docker image prune -f

echo "📦 Running new container..."
docker run -d \\
  --name ${CONTAINER_NAME} \\
  --restart unless-stopped \\
  -p 5200:80 \\
  ${DOCKER_IMAGE}:latest
EOF
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deployment completed successfully!"
    }
    failure {
      echo "❌ Deployment failed!"
    }
  }
}
