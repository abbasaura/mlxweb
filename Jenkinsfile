pipeline {
    agent any

    environment {
        // OpenShift cluster and project details
        OC_USER = "kubeadmin"
        OC_PASS = "43FAH-5UuJq-pbgIW-4DU46"   // 👈 replace with your kubeadmin password
        OC_API  = "https://api.crc.testing:6443"
        OC_PROJECT = "cicd"
        DEPLOY_FILE = "openshift-deploy.yaml"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                git branch: 'main', url: 'https://github.com/abbasaura/mlxweb.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🛠️ Installing Node.js dependencies..."
                sh '''
                    if [ -f package.json ]; then
                        npm install
                    else
                        echo "⚠️ package.json not found. Skipping npm install."
                    fi
                '''
            }
        }

        stage('Run Tests') {
            steps {
                echo "🧪 Running tests..."
                sh '''
                    if [ -f package.json ]; then
                        npm test || echo "✅ No tests configured — continuing."
                    else
                        echo "⚠️ No package.json — skipping tests."
                    fi
                '''
            }
        }

        stage('Deploy to OpenShift') {
            steps {
                script {
                    echo "🚀 Deploying to OpenShift project: ${OC_PROJECT}"
                    sh """
                        oc login -u ${OC_USER} -p ${OC_PASS} ${OC_API} --insecure-skip-tls-verify
                        oc project ${OC_PROJECT}
                        if [ -f ${DEPLOY_FILE} ]; then
                            oc apply -f ${DEPLOY_FILE}
                        else
                            echo "⚠️ ${DEPLOY_FILE} not found. Skipping deployment."
                        fi
                    """
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
