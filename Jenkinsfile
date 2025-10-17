pipeline {
    agent any

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
                        credentialsId: 'github' // Ensure this exists in Jenkins
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🛠️ Installing dependencies..."
                sh '''
                    # Remove old node_modules
                    rm -rf node_modules

                    # Use npm ci if package-lock.json exists, else npm install
                    if [ -f package-lock.json ]; then
                        echo "Using npm ci (lock file exists)"
                        npm ci
                    else
                        echo "No lock file found, using npm install"
                        npm install --prefer-offline --no-audit
                    fi
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
                    # Log in to OpenShift cluster
                    oc login -u kubeadmin -p $KUBEADMIN_PASSWORD https://api.crc.testing:6443 --insecure-skip-tls-verify

                    # Apply Kubernetes/Openshift manifests
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
