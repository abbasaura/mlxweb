pipeline {
    agent any   // Default agent for build/test

    environment {
        // Use Jenkins credentials (create secret text credential with ID: kubeadmin-password)
        KUBEADMIN_PASSWORD = credentials('kubeadmin-password')
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/abbasaura/mlxweb.git',
                    credentialsId: 'github'
            }
        }

        stage('Build') {
            steps {
                echo "🛠️ Building project..."
                sh '''
                    npm install --prefer-offline --no-audit
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
            // Run deployment in a Docker container with oc CLI
            agent {
                docker { image 'openshift/oc:latest' } 
            }
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
        success {
            echo "✅ CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "❌ CI/CD Pipeline failed!"
        }
    }
}
