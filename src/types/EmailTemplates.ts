export const templates = {
  WELCOME_EMAIL: (data: { name: string; appName: string }) => ({
    html: `<h1>Welcome, ${data.name}!</h1><p>Glad to have you at ${data.appName}.</p>`,
    text: `Welcome, ${data.name}! Glad to have you at ${data.appName}.`,
  }),
  PASSWORD_RESET: (data: { url: string }) => ({
    html: `<p>Click <a href="${data.url}">here</a> to reset your password.</p>`,
    text: `Reset your password by visiting: ${data.url}`,
  }),
  SIGN_UP_EMAIL: (data: { name: string; appName: string }) => ({
    html: `<h1>Hi ${data.name}!</h1><p>Thanks for signing up for ${data.appName}.</p>`,
    text: `Hi ${data.name}! Thanks for signing up for ${data.appName}.`,
  }),
} as const; // 'as const' makes the keys literal types
