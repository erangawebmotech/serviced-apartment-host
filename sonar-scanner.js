import sonar from 'sonarqube-scanner';

sonar.scan(
  {
    serverUrl: 'http://149.102.141.32:9005',
    token: 'squ_df70a3c9dfe0356ccc137bbc0f13fa4541762bc3',
    options: {
      'sonar.projectKey': 'sa-host',
      'sonar.projectName': 'Serviced Apartments Host',
      'sonar.sources': 'src',
      'sonar.exclusions': '**/node_modules/**,**/*.test.js,**/build/**',
    },
  },
  () => {
    console.log('SonarQube scan completed');
    process.exit();
  }
);
