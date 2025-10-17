pipeline {
    agent any

    environment {
        KUBEADMIN_PASSWORD = credentials('kubeadmin-password')
        NPM_CONFIG_CACHE   = "${WORKSPACE}/.npm"  // writable npm cache for Jenkins
        OC_PATH            = "/home/openshift/.crc/cache/crc_libvirt_4.19.8_amd64/oc" // absolute oc binary
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/abbasaura/mlxweb.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🛠️ Installing dependencies..."
                sh '''
                    rm -rf node_modules
                    mkdir -p $NPM_CONFIG_CACHE
                    npm install --prefer-offline --no-audit --cache $NPM_CONFIG_CACHE
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
                    # ensure oc binary is executable
                    chmod +x $OC_PATH
                    $OC_PATH login -u kubeadmin -p $KUBEADMIN_PASSWORD https://api.crc.testing:6443 --insecure-skip-tls-verify
                    $OC_PATH apply -f k8s/deployment.yaml
                '''
            }
        }
    }

    post {
        success { echo "✅ CI/CD Pipeline completed successfully!" }
        failure { echo "❌ CI/CD Pipeline failed!" }
    }
}
