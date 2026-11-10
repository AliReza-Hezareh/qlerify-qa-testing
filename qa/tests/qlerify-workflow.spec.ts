import { expect, test as base, type Locator, type Page, type TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { realpathSync, statSync } from 'node:fs';
import path from 'node:path';

const origin = 'https://app.qlerify.com';
const projectPath = /^\/dashboard\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\/?$/i;

type Project = {
  url: URL;
  title: string;
  workflowPrefix: string;
};

function block(info: TestInfo, reason: string): never {
  info.annotations.push({ type: 'blocked', description: reason });
  info.skip(true, reason);
  throw new Error(reason);
}

function localSessionExists() {
  try {
    const authRoot = realpathSync(path.resolve(__dirname, '../.auth'));
    const sessionPath = realpathSync(process.env.QA_STORAGE_STATE ?? '');
    const relative = path.relative(authRoot, sessionPath);
    return relative !== '' && relative !== '..' && !relative.startsWith('..' + path.sep)
      && !path.isAbsolute(relative) && statSync(sessionPath).isFile();
  } catch {
    return false;
  }
}

const test = base.extend<{ project: Project }>({
  project: async ({}, use, info) => {
    if (process.env.CI || process.env.QA_ALLOW_WORKFLOW_WRITES !== '1') {
      block(info, 'Skrivtester kräver en lokal körning med QA_ALLOW_WORKFLOW_WRITES=1.');
    }
    const value = process.env.QA_PROJECT_URL ?? '';
    const url = URL.canParse(value) ? new URL(value) : undefined;
    const projectId = url?.pathname.match(projectPath)?.[1];
    const title = process.env.QA_PROJECT_NAME?.trim();
    if (!url || url.origin !== origin || !projectId || !title || url.search || url.hash || url.username || url.password) {
      block(info, 'Ange exakt URL och namn för det godkända QA-projektet.');
    }
    if (!localSessionExists()) {
      block(info, 'En sparad, lokal Playwright-session under qa/.auth krävs.');
    }
    await use({ url, title, workflowPrefix: '/workflow/' + projectId + '/' });
  },
});

function sameProject(url: URL, project: Project) {
  return url.origin === origin && url.pathname.replace(/\/$/, '') === project.url.pathname.replace(/\/$/, '');
}

function newWorkflowTile(page: Page) {
  return page.locator('.dashboard-card[aria-haspopup="dialog"]').filter({ hasText: 'New Workflow' });
}

async function openProject(page: Page, project: Project, info: TestInfo) {
  try {
    await page.goto(project.url.href, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(url => sameProject(url, project));
    await expect(page.getByText('All Workflows', { exact: true })).toBeVisible();
    await expect(page.getByText(project.title, { exact: true }).filter({ visible: true })).not.toHaveCount(0);
    await expect(newWorkflowTile(page)).toHaveCount(1);
    await expect(newWorkflowTile(page)).toBeVisible();
  } catch {
    block(info, 'Det godkända projektet kunde inte öppnas med redigeringskontrollen synlig. Kontrollera session och projektåtkomst.');
  }
}

function listedWorkflow(page: Page, project: Project, name: string) {
  return page.locator('a[href^="' + project.workflowPrefix + '"]').filter({
    has: page.getByText(name, { exact: true }),
  });
}

function nameField(page: Page) {
  return page.getByRole('textbox', { name: 'Workflow name', exact: true }).filter({ visible: true });
}

function workflowTitle(page: Page) {
  return page.locator('.workflow-quick-rename');
}

function syntheticName(caseId: string) {
  const run = process.env.QA_RUN_ID ?? 'direct';
  return ['QA-AUTO', caseId, run, randomUUID().slice(0, 8)].join(' ');
}

async function createWorkflow(page: Page, project: Project, info: TestInfo, name: string) {
  await openProject(page, project, info);
  await newWorkflowTile(page).click();
  await nameField(page).fill(name);
  await page.getByRole('button', { name: 'Add', exact: true }).filter({ visible: true }).click();

  const title = workflowTitle(page).filter({ hasText: name });
  const link = listedWorkflow(page, project, name);
  await expect(title.or(link)).toBeVisible();
  if (sameProject(new URL(page.url()), project)) await link.click();

  await expect(workflowTitle(page)).toHaveText(name);
  const opened = new URL(page.url());
  expect(opened.origin).toBe(origin);
  expect(opened.pathname.startsWith(project.workflowPrefix)).toBe(true);
  return opened.pathname.split('/').slice(0, 4).join('/');
}

async function openFromList(page: Page, project: Project, name: string, expectedPath: string) {
  const link = listedWorkflow(page, project, name);
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute('href', expectedPath);
  await link.click();
  await expect(page).toHaveURL(url => url.origin === origin && url.pathname === expectedPath);
  await expect(workflowTitle(page)).toHaveText(name);
}

async function renameWorkflow(page: Page, link: Locator, name: string) {
  const tile = page.locator('.workflow-drag-item').filter({ has: link });
  await tile.getByRole('button', { name: 'more_vert', exact: true }).click();
  await page.getByText('Edit', { exact: true }).filter({ visible: true }).click();
  await nameField(page).fill(name);
  await page.getByRole('button', { name: 'Update', exact: true }).filter({ visible: true }).click();
}

async function eventLane(event: Locator) {
  return event.evaluate(el => {
    const eventBounds = el.getBoundingClientRect();
    const center = eventBounds.top + eventBounds.height / 2;
    const canvas = el.closest('.canvas-container');
    const lanes = Array.from(canvas?.querySelectorAll('.lane-title-container') ?? []);
    return lanes.find(lane => {
      const bounds = lane.getBoundingClientRect();
      return center >= bounds.top && center < bounds.bottom;
    })?.textContent?.trim();
  });
}

test('PW-WF-01 – skapa och återöppna ett workflow', async ({ project, page }, info) => {
  const name = syntheticName('PW-WF-01');
  const createdPath = await createWorkflow(page, project, info, name);
  await openProject(page, project, info);
  await openFromList(page, project, name, createdPath);
});

test('PW-WF-02 – ändra workflowets namn och verifiera sparandet', async ({ project, page }, info) => {
  const name = syntheticName('PW-WF-02');
  const updatedName = name + ' redigerad ÅÄÖ';
  const createdPath = await createWorkflow(page, project, info, name);
  await openProject(page, project, info);
  const link = listedWorkflow(page, project, name);
  await expect(link).toHaveAttribute('href', createdPath);
  await renameWorkflow(page, link, updatedName);
  await expect(listedWorkflow(page, project, name)).toHaveCount(0);
  await openFromList(page, project, updatedName, createdPath);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(workflowTitle(page)).toHaveText(updatedName);
});

test('PW-WF-03 – spara en diagramändring och kontrollera samma lane', async ({ project, page }, info) => {
  const name = syntheticName('PW-WF-03');
  const createdPath = await createWorkflow(page, project, info, name);
  await page.getByRole('button', { name: /Add start point/ }).click();
  const event = page.locator('svg#flowchart .event-name');
  await expect(event).toHaveCount(1);
  await expect(event).toBeEditable();
  const id = await event.getAttribute('id');
  expect(id, 'Eventets identifierare ska vara synlig i diagrammet.').toBeTruthy();

  const text = 'QA Betalning mottagen ÅÄÖ';
  await event.fill(text);
  await event.press('Enter');
  await expect(event).toHaveText(text);
  await expect.poll(() => eventLane(event)).toBe('Lane 1');

  await openProject(page, project, info);
  await openFromList(page, project, name, createdPath);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(event).toHaveCount(1);
  await expect(event).toHaveAttribute('id', id!);
  await expect(event).toHaveText(text);
  await expect.poll(() => eventLane(event)).toBe('Lane 1');
});
