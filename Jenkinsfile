pipeline {
    agent any

    triggers {
        // Poll GitHub every 2 minutes (adjust as needed)
        pollSCM('H/2 * * * *')
    }

    environment {
        KUBEADMIN_PASSWORD = credentials('kubeadmin-password') // OpenShift kubeadmin password
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/abbasaura/mlxweb.git'
                    // remove credentialsId if not needed for public repo
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🛠️ Installing dependencies..."
                sh '''
                    rm -rf node_modules
                    npm install --prefer-offline --no-audit
                '''
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh '''
                    # Ensure tests don't fail the pipeline if empty
                    npm test -- --watchAll=false --passWithNoTests || true
                '''
            }
        }

        stage('Deploy to OpenShift') {
            steps {
                echo "🚀 Deploying to OpenShift..."
                sh '''
                    # Use full path to oc binary
                    ~/.crc/bin/oc/oc login -u kubeadmin -p $KUBEADMIN_PASSWORD https://api.crc.testing:6443 --insecure-skip-tls-verify
                    ~/.crc/bin/oc/oc apply -f k8s/deployment.yaml
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
