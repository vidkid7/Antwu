// The source scans remain authoritative; do not guess an unclear handwritten BS date.
import fs from 'node:fs';
import { getRecord, saveRecord } from '../src/lib/server/store';
const filename = 'src/data/content-seed.json';
const content = JSON.parse(fs.readFileSync(filename, 'utf8'));
for (const collection of ['documents', 'notices']) {
  for (const item of content[collection]) {
    item.date = '';
    if (item.id === 'taxi-campaign') item.title = { en: 'Taxi organisation campaign', ne: 'ट्याक्सी संगठन सुदृढीकरण अभियान' };
    const existing = getRecord(collection, item.id);
    if (existing) saveRecord(collection, { ...existing, date: '', title: item.title });
  }
}
fs.writeFileSync(filename, JSON.stringify(content, null, 2) + '\n');
const builder = 'scripts/integrate-content.py';
let code = fs.readFileSync(builder, 'utf8');
code = code.replace("loc('Taxi organisation campaign, 2083 BS','ट्याक्सी संगठन सुदृढीकरण अभियान, २०८३')", "loc('Taxi organisation campaign','ट्याक्सी संगठन सुदृढीकरण अभियान')").replace("'date':'2083 BS'", "'date':''").replace("'date':'2083/05/10 BS'", "'date':''");
fs.writeFileSync(builder, code);
console.log('Preserved original document dates in scans without unverified transcription.');
