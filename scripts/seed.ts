import { getPublicContent } from '../src/lib/server/store';
const content = getPublicContent();
console.log(`Content store ready: ${content.committeeMembers.length} committee members. Existing edits are preserved.`);
