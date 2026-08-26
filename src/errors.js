// Templates polyglot de errores de compilación creíbles para el stack de Isaac:
// TypeScript, Angular, React, .NET/C#, Node.js, webpack, AWS CDK.

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];

const timestamp = () => {
  const d = new Date();
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};

const FILES_TS_ANGULAR = [
  'apps/web/src/app/profile/profile.component.ts',
  'apps/web/src/app/profile/profile.component.html',
  'apps/web/src/app/skills/skills.component.ts',
  'apps/web/src/app/shared/user.service.ts',
  'libs/ui/src/lib/avatar/avatar.component.ts',
];

const FILES_TS_REACT = [
  'apps/portfolio/src/components/Hero.tsx',
  'apps/portfolio/src/components/Skills.tsx',
  'apps/portfolio/src/hooks/useProfile.ts',
  'apps/portfolio/src/pages/index.tsx',
  'packages/shared/src/types/profile.ts',
];

const FILES_CS = [
  'services/ProfileService/Controllers/ProfileController.cs',
  'services/ProfileService/Repositories/UserRepository.cs',
  'services/ProfileService/Services/ProfileService.cs',
  'services/ProfileService/Program.cs',
];

const FILES_NODE_AWS = [
  'services/api/src/handlers/get-profile.ts',
  'services/api/src/lib/dynamo-client.ts',
  'services/api/src/lib/openai-client.ts',
  'infra/lib/profile-stack.ts',
  'infra/lib/api-stack.ts',
  'packages/ai-copilot/src/agents/profile-agent.ts',
];

const IDENTIFIERS = ['UserProfile', 'IProfileRepository', 'ProfileDto', 'SkillTag', 'HeroProps', 'AvatarProps', 'CopilotAgent'];
const MODULES = ['@aws-sdk/client-dynamodb', 'openai', '@angular/material', 'react-query', '@nx/webpack', 'aws-cdk-lib/aws-lambda-nodejs'];

const TEMPLATES = [
  // TS2345
  () => {
    const file = pick(FILES_TS_ANGULAR.concat(FILES_TS_REACT));
    const line = 30 + rand(180);
    const col = 6 + rand(30);
    const id = pick(IDENTIFIERS);
    return {
      head: `ERROR in ${file}:${line}:${col}`,
      code: 'TS2345',
      msg: `Argument of type 'string | undefined' is not assignable to parameter of type '${id}'.\n  Type 'undefined' is not assignable to type '${id}'.`,
      snippet: [
        { text: `${line - 2} |   const profile = await fetchProfile(userId);` },
        { text: `${line - 1} |   if (!profile) return null;` },
        { text: `${line} |   return render(profile.name);` },
        { text: `   |                    ^^^^^^^^^^^^`, caret: true },
      ],
    };
  },

  // TS2322
  () => {
    const file = pick(FILES_TS_REACT);
    const line = 40 + rand(90);
    return {
      head: `ERROR in ${file}:${line}:12`,
      code: 'TS2322',
      msg: `Type '{ name: string; role: string; }' is not assignable to type 'UserProfile'.\n  Property 'id' is missing in type '{ name: string; role: string; }' but required in type 'UserProfile'.`,
      snippet: [
        { text: `${line} |   const user: UserProfile = { name, role };` },
        { text: `   |         ^^^^`, caret: true },
      ],
    };
  },

  // TS7006 implicit any
  () => {
    const file = pick(FILES_NODE_AWS);
    const line = 20 + rand(200);
    const col = 18 + rand(20);
    const p = pick(['event', 'ctx', 'record', 'payload', 'req']);
    return {
      head: `ERROR in ${file}:${line}:${col}`,
      code: 'TS7006',
      msg: `Parameter '${p}' implicitly has an 'any' type.`,
      snippet: [
        { text: `${line} | export const handler = async (${p}) => {` },
        { text: `   |                                ${'^'.repeat(p.length)}`, caret: true },
      ],
    };
  },

  // Angular NG8002
  () => {
    const file = pick(FILES_TS_ANGULAR);
    return {
      head: `ERROR in ${file}`,
      code: 'NG8002',
      msg: `Can't bind to 'userProfile' since it isn't a known property of 'app-skills'.\n  1. If 'app-skills' is an Angular component and it has 'userProfile' input, then verify that it is part of this module.\n  2. If 'app-skills' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component.`,
      snippet: [],
    };
  },

  // C# CS0246
  () => {
    const file = pick(FILES_CS);
    const line = 20 + rand(150);
    const col = 20 + rand(30);
    const id = pick(IDENTIFIERS);
    return {
      head: `${file}(${line},${col}): error CS0246:`,
      code: '',
      msg: `The type or namespace name '${id}' could not be found (are you missing a using directive or an assembly reference?)`,
      snippet: [],
    };
  },

  // C# CS7036
  () => {
    const file = pick(FILES_CS);
    const line = 40 + rand(100);
    return {
      head: `${file}(${line},18): error CS7036:`,
      code: '',
      msg: `There is no argument given that corresponds to the required parameter 'profileId' of 'ProfileService.GetProfile(Guid, CancellationToken)'`,
      snippet: [],
    };
  },

  // webpack Module not found
  () => {
    const mod = pick(MODULES);
    const file = pick(FILES_NODE_AWS.concat(FILES_TS_REACT));
    return {
      head: `ERROR in ${file}`,
      code: '',
      msg: `Module not found: Error: Can't resolve '${mod}' in '${file.split('/').slice(0, -1).join('/')}'`,
      snippet: [
        { text: `webpack 5.94.0 compiled with ${20 + rand(60)} errors in ${1200 + rand(3000)}ms` },
      ],
    };
  },

  // npm ELIFECYCLE
  () => ({
    head: `npm ERR! code ELIFECYCLE`,
    code: '',
    msg: `npm ERR! errno 1\nnpm ERR! cd-speak@0.1.0 build: \`nx run-many --target=build --all && dotnet build && cdk synth\`\nnpm ERR! Exit status 1\nnpm ERR! Failed at the cd-speak@0.1.0 build script.`,
    snippet: [],
  }),

  // dotnet build summary
  () => ({
    head: `Build FAILED.`,
    code: '',
    msg: `    0 Warning(s)\n    ${12 + rand(40)} Error(s)`,
    snippet: [
      { text: `Time Elapsed 00:00:${String(8 + rand(50)).padStart(2, '0')}.${rand(99)}` },
    ],
  }),

  // AWS CDK deploy
  () => {
    const stack = pick(['ProfileStack', 'ApiStack', 'ProfileService-Prod', 'AiCopilotStack']);
    return {
      head: `Error: Failed to deploy stack: ${stack}`,
      code: '',
      msg: `    at CloudFormationDeployments.deployStack (/root/.npm/_npx/aws-cdk/lib/api/deploy-stack.ts:${100 + rand(80)}:15)\n    at async deployStacks (/root/.npm/_npx/aws-cdk/lib/cli/cli.ts:${200 + rand(50)}:9)\n    at async initCommandLine (/root/.npm/_npx/aws-cdk/lib/cli/cli.ts:${300 + rand(40)}:12)`,
      snippet: [
        { text: `❌  ${stack} failed: ValidationError: Template format error: Unresolved resource dependencies` },
      ],
    };
  },

  // Node runtime crash mid-build
  () => ({
    head: `Error: Cannot find module 'dist/apps/web/main.js'`,
    code: '',
    msg: `    at Module._resolveFilename (node:internal/modules/cjs/loader:1077:15)\n    at Module._load (node:internal/modules/cjs/loader:922:27)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)\n    at node:internal/main/run_main_module:23:47`,
    snippet: [
      { text: `Node.js v20.11.1` },
    ],
  }),
];

export function nextError() {
  const template = pick(TEMPLATES)();
  return { ...template, timestamp: timestamp() };
}
