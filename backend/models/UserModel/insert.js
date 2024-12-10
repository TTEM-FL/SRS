import db from '~/db/init.js';
import { requireKeys } from '~/services/requireKeys';

const insert = {
  createFrom: (oauthProvider, oauthProfile) => {
    switch (oauthProvider) {
      case 'github':
        return insert.create({
          oauthProvider: 'github',
          oauthId: oauthProfile.id.toString(),
          username: oauthProfile.login,
          avatarUrl: oauthProfile.avatar_url,
          email: oauthProfile.email
        });
      case 'google':
        return insert.create({
          oauthProvider: 'google',
          oauthId: oauthProfile.id.toString(),
          username: oauthProfile.name,
          avatarUrl: oauthProfile.picture,
          email: oauthProfile.email
        });
      case 'flyinglanguages':
        return insert.create({
          oauthProvider: 'flyinglanguages',
          oauthId: oauthProfile.id.toString(),
          username: oauthProfile.username,
          avatarUrl: oauthProfile.avatar_url,
          email: oauthProfile.email
        });
      default:
        throw new Error(`No such oauthProvider as '${oauthProvider}'.`);
    }
  },

  create: requireKeys(['oauthProvider', 'oauthId', 'username', 'email'],
    (user) =>
      db.one(
        `
        INSERT INTO "user"
          (
            oauth_provider, oauth_id,
            username, email,
            created_at
          )
        VALUES
          (
            \${oauthProvider}, \${oauthId},
            \${username}, \${email},
            now()
          )
        RETURNING *
        `,
        {
          oauthProvider: user.oauthProvider,
          oauthId: user.oauthId,
          username: user.username,
          email: user.email
        }
      )
  )
};

export default insert;
