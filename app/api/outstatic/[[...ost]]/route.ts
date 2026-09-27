import { OutstaticApi } from 'outstatic';

// Anmeldung per GitHub (Callback /api/outstatic/callback) und Zugriffe des
// Editors auf das Repo. Ohne diese Route öffnet sich /outstatic, aber niemand
// kann sich anmelden.
export const GET = OutstaticApi.GET;
export const POST = OutstaticApi.POST;
