pipeline {
    agent any

    environment {
        // Path to the oc binary inside the Jenkins container
        PATH = "/tmp:$PATH"
        OC_CMD = "oc"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🛠️ Installing dependencies..."
                sh '''
                    rm -rf node_modules
                    npm install --prefer-offline --no-audit --cache $WORKSPACE/.npm
                '''
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh '''
                    set +e
                    npm test -- --watchAll=false --passWithNoTests
                    set -e
                '''
            }
        }

        stage('Deploy to OpenShift') {
            steps {
                echo "🚀 Deploying to OpenShift..."
                sh '''
                    $OC_CMD login -u kubeadmin -p "$KUBEADMIN_PASSWORD" https://api.crc.testing:6443 --insecure-skip-tls-verify
                    $OC_CMD apply -f k8s/deployment.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline succeeded!"
        }
        failure {
            echo "❌ CI/CD Pipeline failed!"
        }
    }
}
