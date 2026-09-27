import NextAuth, { type NextAuthConfig } from 'next-auth';

/**
 * Anmeldung mit dem Konto der Schulhomepage (Doku-Spec §3.4).
 *
 * Wie in ggs-stundenplan: OAuth gegen den WP OAuth Server, die Rollen holt
 * danach WPGraphQL (`currentUser.roles`). Ein Plugin in WordPress ist dafür
 * nicht nötig.
 *
 * In der Sitzung liegen nur die rohen WordPress-Rollen und der Vorname. Die
 * Abbildung auf Doku-Rollen passiert bei jeder Anfrage in `getViewer`, damit
 * eine Änderung an `lib/roles.ts` ohne Neuanmeldung greift.
 */

declare module 'next-auth' {
  interface Session {
    user: { name: string; wpRoles: string[] };
  }
  interface User {
    firstName: string;
    wpRoles: string[];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    firstName?: string;
    wpRoles?: string[];
  }
}

const WP_BASE_URL = process.env.WORDPRESS_OAUTH_BASE_URL ?? 'https://goethe-gymnasium-stolberg.de';

interface WpCurrentUser {
  id: string;
  firstName: string | null;
  roles: string[] | null;
}

async function fetchCurrentUser(accessToken: string): Promise<WpCurrentUser> {
  const response = await fetch(`${WP_BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-APP-SECRET': process.env.WORDPRESS_APP_SECRET ?? '',
    },
    body: JSON.stringify({ query: '{ currentUser { id firstName roles } }' }),
  });
  if (!response.ok) throw new Error(`WordPress GraphQL antwortet mit HTTP ${response.status}`);

  const { data } = (await response.json()) as { data?: { currentUser?: WpCurrentUser | null } };
  if (!data?.currentUser) throw new Error('WordPress liefert keinen angemeldeten Benutzer');
  return data.currentUser;
}

export const authConfig: NextAuthConfig = {
  providers: [
    {
      id: 'wordpress',
      name: 'Schulhomepage',
      type: 'oauth',
      clientId: process.env.WORDPRESS_OAUTH_CLIENT_ID,
      clientSecret: process.env.WORDPRESS_OAUTH_CLIENT_SECRET,
      authorization: { url: `${WP_BASE_URL}/oauth/authorize`, params: { scope: 'basic' } },
      token: { url: `${WP_BASE_URL}/oauth/token` },
      userinfo: {
        url: `${WP_BASE_URL}/oauth/me`,
        async request({ tokens }: { tokens: { access_token: string } }) {
          return fetchCurrentUser(tokens.access_token);
        },
      },
      profile(profile: WpCurrentUser) {
        return {
          id: String(profile.id),
          firstName: profile.firstName ?? '',
          wpRoles: profile.roles ?? [],
        };
      },
    },
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName;
        token.wpRoles = user.wpRoles;
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.firstName ?? '',
        wpRoles: token.wpRoles ?? [],
      };
      return session;
    },
  },
  pages: { signIn: '/anmelden', error: '/anmelden' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  // Hinter Traefik: Host aus den Weiterleitungs-Headern übernehmen
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
