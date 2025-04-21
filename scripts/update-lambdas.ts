import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function getChangedLambdas(): string[] {
  try {
    // Intentar obtener los cambios del último commit
    const output = execSync('git diff --name-only HEAD~1').toString();
    const changedFiles = output.split('\n').filter(Boolean);
    
    const lambdaDirs = new Set<string>();
    changedFiles.forEach(file => {
      if (file.startsWith('lambdas/')) {
        const dir = file.split('/')[1];
        if (dir) lambdaDirs.add(dir);
      }
    });
    
    return Array.from(lambdaDirs);
  } catch (error) {
    // Si hay un error (probablemente porque es el primer commit), retornar todas las Lambdas
    console.log('No se pudo obtener los cambios del último commit, actualizando todas las Lambdas');
    return ['auth', 'products', 'orders']; // Ajusta esto según tus Lambdas
  }
}

function buildProject() {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
}

function updateLambda(lambdaName: string) {
  console.log(`Updating Lambda: ${lambdaName}`);
  execSync(`npx cdk deploy --require-approval never --no-notices --all --app "npx ts-node bin/lambda.ts"`, { stdio: 'inherit' });
}

function main() {
  const changedLambdas = getChangedLambdas();
  
  if (changedLambdas.length === 0) {
    console.log('No Lambda functions to update');
    return;
  }
  
  buildProject();
  
  changedLambdas.forEach(lambda => {
    updateLambda(lambda);
  });
  
  // Write output to file for GitHub Actions
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    const output = `updated_lambdas=${changedLambdas.join(',')}`;
    fs.writeFileSync(outputFile, output);
  }
}

main(); 