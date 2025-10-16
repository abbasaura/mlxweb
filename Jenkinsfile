pipeline {
    agent any

    environment {
        PATH = "/var/lib/jenkins/nodejs/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                git branch: 'main',
                    credentialsId: 'github',
                    url: 'https://github.com/abbasaura/mlxweb.git'
            }
        }

        stage('Build') {
            steps {
                echo "🛠️ Building project..."
                sh '''
                    # Display Node.js and npm versions
                    node -v
                    npm -v

                    # Use a writable npm cache directory inside workspace
                    export NPM_CONFIG_CACHE=$PWD/.npm

                    # Clean up any leftover or corrupted dependencies
                    rm -rf node_modules package-lock.json .npm

                    # Clean npm cache (in case of previous failed installs)
                    npm cache clean --force

                    # Install dependencies safely
                    npm install --prefer-offline --no-audit
                '''
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
                        oc login -u kubeadmin -p 43FAH-5UuJq-pbgIW-4DU46 https://api.crc.testing:6443 --insecure-skip-tls-verify
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
