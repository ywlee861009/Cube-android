import esbuild from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../app/src/main/assets/js/lib');

// Node.js 전용 built-in 모듈을 브라우저 번들에서 스텁 처리
const nodeBuiltinStubPlugin = {
  name: 'node-builtin-stub',
  setup(build) {
    // crypto → 브라우저에서는 globalThis.crypto 사용하므로 이 경로는 dead code
    build.onResolve({ filter: /^crypto$/ }, () => ({
      path: 'crypto',
      namespace: 'node-stub',
    }));
    // worker_threads → Node 전용, 브라우저에서 사용 안 됨
    build.onResolve({ filter: /^worker_threads$/ }, () => ({
      path: 'worker_threads',
      namespace: 'node-stub',
    }));
    // comlink node-adapter → Node 전용
    build.onResolve({ filter: /node-adapter/ }, () => ({
      path: 'node-adapter',
      namespace: 'node-stub',
    }));

    build.onLoad({ filter: /.*/, namespace: 'node-stub' }, (args) => {
      if (args.path === 'crypto') {
        return {
          contents: `
            // Stub: 브라우저에서 globalThis.crypto.getRandomValues 가 있어서 이 경로 미도달
            export const webcrypto = globalThis.crypto;
            export default { webcrypto: globalThis.crypto };
          `,
          loader: 'js',
        };
      }
      // worker_threads, node-adapter → 빈 스텁
      return {
        contents: `
          export const Worker = undefined;
          export default {};
        `,
        loader: 'js',
      };
    });
  },
};

await esbuild.build({
  entryPoints: [resolve(__dirname, 'entry.js')],
  bundle: true,
  format: 'iife',
  globalName: '_cubingSolverSetup',
  outfile: resolve(outDir, 'cubing-solver.bundle.js'),
  platform: 'browser',
  target: ['es2017'],
  minify: false,
  treeShaking: true,
  logLevel: 'info',
  plugins: [nodeBuiltinStubPlugin],
});

console.log(`✓ bundle → ${outDir}/cubing-solver.bundle.js`);
