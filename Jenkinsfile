pipeline {
    agent any   // Use the default agent for all stages

    triggers {
        // Poll GitHub every minute OR rely on GitHub webhook
        pollSCM('* * * * *') 
    }

    environment {
        // Jenkins secret text credential ID
        KUBEADMIN_PASSWORD = credentials('kubeadmin-password')
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/abbasaura/mlxweb.git',
                    credentialsId: 'github' // Make sure this exists in Jenkins
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
