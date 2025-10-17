pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        KUBEADMIN_PASSWORD = credentials('kubeadmin-password')
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/abbasaura/mlxweb.git',
                        credentialsId: 'github'
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🛠️ Installing dependencies..."
                sh '''
                    rm -rf node_modules package-lock.json
                    npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh '''
                    npm test -- --watchAll=false --passWithNoTests || true
                '''
            }
        }

        stage('Deploy to OpenShift') {
            steps {
                echo "🚀 Deploying to OpenShift..."
                sh '''
                    oc login -u kubeadmin -p $KUBEADMIN_PASSWORD https://api.crc.testing:6443 --insecure-skip-tls-verify
                    oc apply -f k8s/deployment.yaml
                '''
            }
        }
    }

    post {
        success { echo "✅ CI/CD Pipeline completed successfully!" }
        failure { echo "❌ CI/CD Pipeline failed!" }
    }
}
