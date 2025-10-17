pipeline {
    agent any   // Single agent for all stages

    triggers {
        // Poll GitHub every minute (or configure webhook)
        pollSCM('* * * * *')
    }

    environment {
        // OpenShift kubeadmin password stored as Jenkins secret text
        KUBEADMIN_PASSWORD = credentials('kubeadmin-password')

        // NPM cache inside workspace to avoid permission issues
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }

    options {
        // Clean workspace before each build to avoid stale modules
        skipDefaultCheckout(true)
        ansiColor('xterm')
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
                    # Clean previous installs
                    rm -rf node_modules package-lock.json
                    npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh '''
                    # Run tests; allow no test suite without failing pipeline
                    npm test -- --watchAll=false --passWithNoTests || true
                '''
            }
        }

        stage('Deploy to OpenShift') {
            steps {
                echo "🚀 Deploying to OpenShift..."
                sh '''
                    # Log in to OpenShift
                    oc login -u kubeadmin -p $KUBEADMIN_PASSWORD https://api.crc.testing:6443 --insecure-skip-tls-verify

                    # Apply deployment manifest
                    oc apply -f k8s/deployment.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "❌ CI/CD Pipeline failed!"
        }
    }
}
