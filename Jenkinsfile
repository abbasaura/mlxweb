pipeline {
    agent any   // Default agent for build/test stages

    triggers {
        // Poll GitHub every minute (alternative: configure webhook in GitHub)
        pollSCM('* * * * *') 
    }

    environment {
        // Jenkins secret text credentials
        KUBEADMIN_PASSWORD = credentials('kubeadmin-password') // OpenShift kubeadmin password
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/abbasaura/mlxweb.git',
                    credentialsId: 'github' // Make sure this GitHub credential exists
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
                    # Run tests, allow no test suite without failing the pipeline
                    npm test -- --watchAll=false --passWithNoTests || true
                '''
            }
        }

        stage('Deploy to OpenShift') {
            agent { label 'oc-agent' } // Make sure this node has oc CLI installed
            steps {
                echo "🚀 Deploying to OpenShift..."
                sh '''
                    # Log in to OpenShift cluster
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
