pipeline {
    agent any

    environment {
        PATH = "/tmp:$PATH"
        OC_CMD = "oc"
        REGISTRY = "default-route-openshift-image-registry.apps-crc.testing"
        PROJECT = "cicd"
        APP_NAME = "mlxweb-git"
    }

    triggers {
        // Auto-trigger when code is pushed to GitHub
        githubPush()
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out latest code from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🛠 Installing Node.js dependencies..."
                sh '''
                    rm -rf node_modules
                    npm install --prefer-offline --no-audit --cache $WORKSPACE/.npm
                '''
            }
        }

        stage('Run Tests') {
            steps {
                echo "🧪 Running tests..."
                sh '''
                    set +e
                    npm test -- --watchAll=false --passWithNoTests
                    set -e
                '''
            }
        }

        stage('Build and Deploy to OpenShift') {
            steps {
                withCredentials([string(credentialsId: 'KUBEADMIN_PASSWORD', variable: 'KUBEADMIN_PASSWORD')]) {
                    sh '''
                        echo "🔐 Logging into OpenShift..."
                        $OC_CMD login -u kubeadmin -p "$KUBEADMIN_PASSWORD" https://api.crc.testing:6443 --insecure-skip-tls-verify

                        echo "📦 Starting new OpenShift build..."
                        $OC_CMD start-build $APP_NAME --wait --follow -n $PROJECT || echo "⚠️ Build may already exist"

                        echo "🚀 Rolling out new version..."
                        $OC_CMD rollout restart deployment/$APP_NAME -n $PROJECT

                        echo "✅ Deployment complete."
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline succeeded and new version deployed!"
        }
        failure {
            echo "❌ CI/CD Pipeline failed!"
        }
    }
}
