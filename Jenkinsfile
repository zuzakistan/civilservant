pipeline {
  agent {
    node {
      label 'master'
    }

  }
  stages {
    stage('error') {
      steps {
        sshScript(script: '/home/ec2-user/cicd.sh ', remote: '34.241.173.208')
      }
    }

  }
}