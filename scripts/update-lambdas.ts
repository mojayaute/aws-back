import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

const LAMBDAS_DIR = join(__dirname, '../lambdas');

function getChangedLambdas(): string[] {
  // Obtener la lista de Lambdas modificadas en el último commit
  const result = execSync('git diff --name-only HEAD~1 HEAD').toString();
  const changedFiles = result.split('\n');
  
  return changedFiles
    .filter(file => file.startsWith('lambdas/'))
    .map(file => {
      const parts = file.split('/');
      return parts[1]; // Retorna el nombre de la Lambda (auth, products, etc.)
    })
    .filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados
}

async function updateLambdas() {
  try {
    const changedLambdas = getChangedLambdas();
    
    if (changedLambdas.length === 0) {
      console.log('No hay Lambdas modificadas para actualizar');
      return;
    }

    console.log('Lambdas a actualizar:', changedLambdas);

    // Construir el proyecto
    execSync('npm run build', { stdio: 'inherit' });

    // Actualizar cada Lambda usando CDK
    for (const lambda of changedLambdas) {
      console.log(`Actualizando Lambda: ${lambda}`);
      execSync(`npx cdk deploy --require-approval never --exclusively LambdaStack-${lambda}`, { stdio: 'inherit' });
    }

  } catch (error) {
    console.error('Error al actualizar las Lambdas:', error);
    process.exit(1);
  }
}

updateLambdas(); 