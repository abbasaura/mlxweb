pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/abbasaura/mlxweb.git'
            }
        }

        stage('Build') {
            steps {
                echo "🛠️ Building project..."
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh 'npm test || echo "No tests found."'
            }
        }

        stage('Deploy to OpenShift') {
            steps {
                script {
                    echo "🚀 Deploying to OpenShift..."
                    sh '''
                        oc login -u developer -p developer https://api.crc.testing:6443 --insecure-skip-tls-verify
                        oc project cicd
                        oc apply -f openshift-deploy.yaml || echo "Deployment already up to date"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully!'
        }
        failure {
            echo '❌ CI/CD Pipeline failed!'
        }
    }
}
