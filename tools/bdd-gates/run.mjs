import fs from 'node:fs';
import { evaluateRepoContext } from './repo-context.mjs';
import { evaluateSpecContext } from './spec-context.mjs';
import { evaluateGate1 } from './gate1.mjs';
import { evaluateGate2 } from './gate2.mjs';

const evaluators = {
  'repo-context': evaluateRepoContext,
  'spec-context': evaluateSpecContext,
  gate1: evaluateGate1,
  gate2: evaluateGate2,
};

function usage() {
  return 'Usage: node tools/bdd-gates/run.mjs <repo-context|spec-context|gate1|gate2> <input-json-file>';
}

const evaluatorName = process.argv[2];
const inputFile = process.argv[3];

if (!evaluatorName || !inputFile || !evaluators[evaluatorName]) {
  console.error(usage());
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
} catch (error) {
  console.error(`Invalid input file: ${error.message}`);
  process.exit(1);
}

const result = evaluators[evaluatorName](payload);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
