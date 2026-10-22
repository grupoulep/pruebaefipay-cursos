import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Download, CheckCircle2 } from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKFLOW_YAML = `name: Despliegue de CREDIULEP en GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del código
        uses: actions/checkout@v4

      - name: Configurar Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Instalar dependencias
        run: npm install --legacy-peer-deps

      - name: Compilar aplicación para producción (dist)
        run: npm run build

      - name: Copiar index.html a 404.html para rutas SPA en GitHub Pages
        run: cp dist/index.html dist/404.html

      - name: Configurar GitHub Pages
        uses: actions/configure-pages@v5

      - name: Subir artefacto de producción
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Publicar en GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [githubUser, setGithubUser] = useState('grupoulep');
  const [repoName, setRepoName] = useState('crediulep-cursos');
  const [activeTab, setActiveTab] = useState<'comandos' | 'workflow' | 'config'>('comandos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const cleanUser = githubUser.trim() || 'tu-usuario';
  const cleanRepo = repoName.trim() || 'crediulep-cursos';
  const pagesUrl = `https://${cleanUser}.github.io/${cleanRepo}/`;

  const gitCommands = [
    `git init`,
    `git add .`,
    `git commit -m "Despliegue tienda virtual CREDIULEP con pasarela Efipay"`,
    `git branch -M main`,
    `git remote add origin https://github.com/${cleanUser}/${cleanRepo}.git`,
    `git push -u origin main`,
  ].join('\n');

  const directDeployCommands = [
    `# Alternativa: publicar directamente a la rama gh-pages`,
    `npm install`,
    `npm run deploy`,
  ].join('\n');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadWorkflow = () => {
    const blob = new Blob([WORKFLOW_YAML], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gh-deploy-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full overflow-hidden shadow-xl my-6">
        {/* Header */}
        <div className="bg-[#131924] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="space-y-0.5">
            <h2 id="gh-deploy-title" className="text-base font-bold text-white">
              Despliegue en GitHub Pages — CREDIULEP
            </h2>
            <p className="text-xs text-slate-400">
              Archivos configurados en el proyecto: .github/workflows/deploy.yml · vite.config.ts ·
              package.json
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar asistente de despliegue en GitHub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Status Summary */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                El código ya está listo para desplegarse en GitHub Pages
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Se ha configurado <code className="font-mono-tabular">base: &apos;./&apos;</code> en{' '}
                <code className="font-mono-tabular">vite.config.ts</code>, el script{' '}
                <code className="font-mono-tabular">npm run deploy</code> con{' '}
                <code className="font-mono-tabular">gh-pages</code> y el workflow automático en{' '}
                <code className="font-mono-tabular">.github/workflows/deploy.yml</code>.
              </p>
            </div>
          </div>

          {/* Custom Repository URL Generator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <label
                htmlFor="gh-user-input"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Tu usuario u organización en GitHub
              </label>
              <input
                id="gh-user-input"
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono-tabular"
                placeholder="grupoulep"
              />
            </div>
            <div>
              <label
                htmlFor="gh-repo-input"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Nombre del repositorio
              </label>
              <input
                id="gh-repo-input"
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono-tabular"
                placeholder="crediulep-cursos"
              />
            </div>
            <div className="sm:col-span-2 pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span>URL pública de tu tienda en GitHub Pages:</span>
              <span className="font-mono-tabular font-semibold text-slate-900">{pagesUrl}</span>
            </div>
          </div>

          {/* Segmented Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('comandos')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'comandos'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>1. Comandos Git y Despliegue</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('workflow')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'workflow'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>2. GitHub Actions (.yml)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('config')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>3. Configuración package.json &amp; Vite</span>
            </button>
          </div>

          {activeTab === 'comandos' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">
                    Opción A: Subir a GitHub y activar despliegue automático (GitHub Actions)
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(gitCommands, 'git-cmds')}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === 'git-cmds' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar comandos</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular text-xs overflow-x-auto leading-relaxed">
                  {gitCommands}
                </pre>
                <p className="text-xs text-slate-600">
                  Luego, en tu repositorio de GitHub entra a <strong>Settings → Pages</strong> y en{' '}
                  <strong>Source</strong> elige <strong>GitHub Actions</strong>.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">
                    Opción B: Publicar directamente con el paquete gh-pages
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(directDeployCommands, 'gh-pages-cmd')}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === 'gh-pages-cmd' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular text-xs overflow-x-auto leading-relaxed">
                  {directDeployCommands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tabular text-slate-600">
                  Archivo creado en: .github/workflows/deploy.yml
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(WORKFLOW_YAML, 'yaml')}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === 'yaml' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar YAML</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadWorkflow}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar deploy.yml</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular text-xs overflow-x-auto max-h-64 leading-relaxed">
                {WORKFLOW_YAML}
              </pre>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <p className="font-semibold text-slate-800">
                  Scripts agregados en <code className="font-mono-tabular">package.json</code>:
                </p>
                <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular overflow-x-auto">
{`"scripts": {
  "dev": "vite --port=3000 --host=0.0.0.0",
  "build": "vite build",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist",
  "preview": "vite preview"
}`}
                </pre>
              </div>

              <div className="space-y-1.5">
                <p className="font-semibold text-slate-800">
                  Rutas relativas en <code className="font-mono-tabular">vite.config.ts</code>:
                </p>
                <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular overflow-x-auto">
{`export default defineConfig(() => {
  return {
    base: './', // Permite cargar estilos y JS en cualquier repositorio de GitHub Pages
    plugins: [react(), tailwindcss()],
  };
});`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
