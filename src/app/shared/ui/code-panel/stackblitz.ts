import type { CodeFile } from '../../../content/lesson.model';

const NG = '^22.2.0';

/**
 * Mở code mẫu trên StackBlitz: đóng gói thành một project Angular CLI tối thiểu.
 * SDK được lazy-load khi bấm nút. Cần mạng để StackBlitz chạy.
 */
export async function openInStackblitz(title: string, files: CodeFile[], extra: Record<string, string> = {}): Promise<void> {
  const { default: sdk } = await import('@stackblitz/sdk');
  const projectFiles: Record<string, string> = {
    'package.json': JSON.stringify(
      {
        name: 'bip-hoc-angular-demo',
        private: true,
        scripts: { start: 'ng serve', build: 'ng build' },
        dependencies: {
          '@angular/common': NG,
          '@angular/compiler': NG,
          '@angular/core': NG,
          '@angular/forms': NG,
          '@angular/platform-browser': NG,
          '@angular/router': NG,
          rxjs: '~7.8.0',
          tslib: '^2.3.0',
        },
        devDependencies: {
          '@angular/build': NG,
          '@angular/cli': NG,
          '@angular/compiler-cli': NG,
          typescript: '~6.0.2',
        },
      },
      null,
      2,
    ),
    'angular.json': JSON.stringify(
      {
        version: 1,
        newProjectRoot: 'projects',
        projects: {
          demo: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: {
                  browser: 'src/main.ts',
                  tsConfig: 'tsconfig.json',
                  styles: ['src/styles.css'],
                  assets: [{ glob: '**/*', input: 'public' }],
                },
              },
              serve: { builder: '@angular/build:dev-server', options: { buildTarget: 'demo:build:development' } },
            },
          },
        },
      },
      null,
      2,
    ),
    'tsconfig.json': JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          target: 'ES2022',
          module: 'preserve',
          moduleResolution: 'bundler',
          skipLibCheck: true,
          experimentalDecorators: true,
        },
        angularCompilerOptions: { strictTemplates: true },
        files: ['src/main.ts'],
      },
      null,
      2,
    ),
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>${title}</title></head>\n<body><app-root></app-root></body>\n</html>\n`,
    'src/styles.css': 'body { font-family: system-ui, sans-serif; padding: 16px; }\n',
  };
  for (const f of files) projectFiles[`src/app/${f.name}`] = f.code;
  Object.assign(projectFiles, extra);

  sdk.openProject(
    { title: `Bíp Học Angular — ${title}`, template: 'node', files: projectFiles },
    { newWindow: true, openFile: `src/app/${files[0]?.name ?? 'app.ts'}` },
  );
}
